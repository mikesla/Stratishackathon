import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { CurrentAccountService } from '@shared/services/current-account.service';
import { GlobalService } from '@shared/services/global.service';
import { ModalService } from '@shared/services/modal.service';
import { ClipboardService } from 'ngx-clipboard';
import { forkJoin, interval, Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { catchError, first, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { Mode, TransactionComponent } from '../../smart-contracts/components/modals/transaction/transaction.component';
import { SmartContractsServiceBase } from '../../smart-contracts/smart-contracts.service';
import { Disposable } from '../models/disposable';
import { Mixin } from '../models/mixin';
import { SavedTicket, Ticket } from '../models/ticket';
import { TicketBalanceRequest } from '../models/ticket-balance-request';
import { Log } from '../services/logger.service';
import { pollWithTimeOut } from '../services/polling';
import { TicketsService } from '../services/tickets.service';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { ProgressComponent } from './progress/progress.component';
import { SendTicketComponent } from './send-ticket/send-ticket.component';
import { BuyTicketComponent } from './buy-ticket/buy-ticket.component';


@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
@Mixin([Disposable])
export class TicketsComponent implements OnInit, OnDestroy, Disposable {
  balance: number;
  coinUnit: string;
  ticketBalanceRefreshRequested$ = new Subject<SavedTicket[]>();
  addresses: string[];
  disposed$ = new ReplaySubject<boolean>();
  dispose: () => void;
  selectedAddress: string;
  history = [];
  walletName: string;
  tickets$: Observable<SavedTicket[]>;
  availableTickets: Ticket[] = [];
  private pollingInterval = 5 * 1000; // polling milliseconds
  maxTimeout = 1.5 * 60 * 1000; // wait for about 1.5 minutes
  tickets: SavedTicket[] = [];
  ticketLoading: { [address: string]: string; } = {};

  constructor(
    private ticketService: TicketsService,
    private smartContractsService: SmartContractsServiceBase,
    private clipboardService: ClipboardService,
    private genericModalService: ModalService,
    private modalService: NgbModal,
    private globalService: GlobalService,
    private currentAccountService: CurrentAccountService) {

    this.walletName = this.globalService.getWalletName();

    this.availableTickets = this.ticketService.GetAvailableTickets();
    this.availableTickets.push(new Ticket('Custom', 'custom', 'custom'));
    this.coinUnit = this.globalService.getCoinUnit();
    this.selectedAddress = this.currentAccountService.address;

    this.smartContractsService.GetHistory(this.walletName, this.selectedAddress)
      .pipe(catchError(error => {
          this.showApiError(`Error retrieving transactions. ${error}`);
          return of([]);
        }),
        take(1)
      )
    .subscribe(history => this.history = history);

    this.smartContractsService.GetAddressBalance(this.selectedAddress)
      .pipe(
        catchError(error => {
          this.showApiError(`Error retrieving balance. ${error}`);
          return of(0);
        }),
        take(1)
      )
      .subscribe(balance => this.balance = balance);

    // Update requested ticket balances
    this.ticketBalanceRefreshRequested$
      .pipe(
        tap(ticketsToReload => ticketsToReload.forEach(t => t.balance = null)),
        switchMap(ticketsToReload => this.updateTicketBalances(ticketsToReload)),
        takeUntil(this.disposed$)
      )
      .subscribe();

    interval(this.pollingInterval)
      .pipe(
        switchMap(() => this.updateTicketBalances(this.tickets)),
        takeUntil(this.disposed$)
      )
      .subscribe();
  }

  private updateTicketBalances(tickets: SavedTicket[]) {
    const ticketsWithAddresses = tickets.filter(ticket => !!ticket.address);
    ticketsWithAddresses.forEach(ticket => this.ticketLoading[ticket.address] = 'loading');
    return forkJoin(ticketsWithAddresses.map(ticket => {
      return this.ticketService
        .GetTicketBalance(new TicketBalanceRequest(ticket.address, this.selectedAddress))
        .pipe(catchError(error => {
          Log.error(error);
          Log.log(`Error getting ticket balance for ticket address ${ticket.address}`);
          return of(null);
        }),
        tap(balance => {
          if (balance === null) {
            ticket.balance = null;
            this.ticketLoading[ticket.address] = 'error';
            return;
          }

          this.ticketLoading[ticket.address] = 'loaded';
          if (balance !== ticket.balance) {
            ticket.balance = balance;
          }
        }));
    }));
  }

  ngOnInit() {
    // Clear all the balances to start with
    const tickets = this.ticketService.GetSavedTickets();
    tickets.forEach(t => t.balance = null);
    this.tickets = tickets;

    // Refresh them all
    this.ticketBalanceRefreshRequested$.next(this.tickets);
  }

  ngOnDestroy() {
    this.dispose();
  }

  showApiError(error: string) {
    this.genericModalService.openModal('Error', error);
  }

  clipboardAddressClicked() {
    if (this.selectedAddress && this.clipboardService.copyFromContent(this.selectedAddress)) {
      Log.info(`Copied ${this.selectedAddress} to clipboard`);
    }
  }

  copyTicketAddress(address: string) {
    if (this.clipboardService.copyFromContent(address)) {
      Log.info(`Copied ${this.selectedAddress} to clipboard`);
    }
  }

  addTicket() {
    const modal = this.modalService.open(AddTicketComponent, { backdrop: 'static', keyboard: false });
    (<AddTicketComponent>modal.componentInstance).tickets = this.availableTickets;
    modal.result.then(value => {
      if (value) {

        Log.info('Refresh ticket list');

        this.updateTicketCollection(value);
        this.ticketBalanceRefreshRequested$.next([value]);
      }
    });
  }

  issueTicket() {
    const modal = this.modalService.open(TransactionComponent, { backdrop: 'static', keyboard: false });
    (<TransactionComponent>modal.componentInstance).mode = Mode.IssueEvent;
    (<TransactionComponent>modal.componentInstance).selectedSenderAddress = this.selectedAddress;
    (<TransactionComponent>modal.componentInstance).balance = this.balance;
    (<TransactionComponent>modal.componentInstance).coinUnit = this.coinUnit;
    modal.result.then(value => {
      if (!value || !value.symbol || !value.transactionHash || !value.name) {
        return;
      }

      // start monitoring ticket progress
      const progressModal = this.modalService.open(ProgressComponent, { backdrop: 'static', keyboard: false });
      (<ProgressComponent>progressModal.componentInstance).loading = true;
      (<ProgressComponent>progressModal.componentInstance).title = 'Waiting for Confirmation';
      (<ProgressComponent>progressModal.componentInstance).message = 'Your ticket creation transaction has been broadcast and is waiting to be mined. This window will close once the transaction receives one confirmation.';
      (<ProgressComponent>progressModal.componentInstance).close.subscribe(() => progressModal.close());

      const receiptQuery = this.smartContractsService.GetReceiptSilent(value.transactionHash)
        .pipe(
          catchError(error => {
            // Receipt API returns a 400 if the receipt is not found.
            Log.log(`Receipt not found yet`);
            return of(undefined);
          })
        );

      pollWithTimeOut(this.pollingInterval, this.maxTimeout, receiptQuery)
        .pipe(
          first(r => !!r),
          switchMap(result => {
            // Timeout returns null after completion, use this to throw an error to be handled by the subscriber.
            if (result == null) {
              return throwError(`It seems to be taking longer to issue a ticket. Please go to "Smart Contracts" tab
                to monitor transactions and check the progress of the ticket issuance. Once successful, add ticket manually.`);
            }

            return of(result);
          }),
          switchMap(receipt => !!receipt.error ? throwError(receipt.error) : of(receipt)),
          takeUntil(this.disposed$)
        )
        .subscribe(
          receipt => {
            const newTicketAddress = receipt['newContractAddress'];
            const ticket = new SavedTicket(value.symbol, newTicketAddress, 0, value.name);
            this.ticketService.AddTicket(ticket);
            progressModal.close('ok');
            this.updateTicketCollection(ticket);
            this.ticketBalanceRefreshRequested$.next([ticket]);
          },
          error => {
            this.showError(error);
            Log.error(error);
            progressModal.close('ok');
          }
        );
    });
  }

  showError(error: string) {
    this.genericModalService.openModal('Error', error);
  }

  delete(item: SavedTicket) {
    const modal = this.modalService.open(ConfirmationModalComponent, { backdrop: 'static', keyboard: false });
    (<ConfirmationModalComponent>modal.componentInstance).body = `Are you sure you want to remove "${item.ticker}" ticket`;
    modal.result.then(value => {
      if (!value) { return; }
      const removeResult = this.ticketService.RemoveTicket(item);
      if (removeResult.failure) {
        this.showApiError(removeResult.message);
        return;
      }

      this.tickets.splice(this.tickets.indexOf(item), 1);
    });
  }

  buy(item: SavedTicket) {

    const modal = this.modalService.open(BuyTicketComponent, { backdrop: 'static', keyboard: false });
    (<BuyTicketComponent>modal.componentInstance).walletName = this.walletName;
    (<BuyTicketComponent>modal.componentInstance).selectedBuyerAddress = this.selectedAddress;
    (<BuyTicketComponent>modal.componentInstance).balance = this.balance;
    (<BuyTicketComponent>modal.componentInstance).coinUnit = this.coinUnit;
    (<BuyTicketComponent>modal.componentInstance).ticket = item;
    modal.result.then(value => {

      if (!value || !value.callResponse) {
        return;
      }

      // start monitoring ticket progress
      const progressModal = this.modalService.open(ProgressComponent, { backdrop: 'static', keyboard: false });
      (<ProgressComponent>progressModal.componentInstance).loading = true;
      (<ProgressComponent>progressModal.componentInstance).close.subscribe(() => progressModal.close());
      (<ProgressComponent>progressModal.componentInstance).title = 'Waiting For Confirmation';
      // tslint:disable-next-line:max-line-length
      (<ProgressComponent>progressModal.componentInstance).message = 'Your ticket transfer transaction has been broadcast and is waiting to be mined. This window will close once the transaction receives one confirmation.';
      (<ProgressComponent>progressModal.componentInstance).summary = `Send ${value.amount} ${item.name} to ${value.recipientAddress}`;

      const receiptQuery = this.smartContractsService.GetReceiptSilent(value.callResponse.transactionId)
        .pipe(
          catchError(error => {
            // Receipt API returns a 400 if the receipt is not found.
            Log.log(`Receipt not found yet`);
            return of(undefined);
          })
        );

      pollWithTimeOut(this.pollingInterval, this.maxTimeout, receiptQuery)
        .pipe(
          first(r => !!r),
          switchMap(result => {
            // Timeout returns null after completion, use this to throw an error to be handled by the subscriber.
            if (result === null) {
              return throwError(`It seems to be taking longer to transfer tickets. Please go to "Smart Contracts" tab
                to monitor transactions and check the progress of the ticket transfer.`);
            }

            return of(result);
          }),
          takeUntil(this.disposed$)
        )
        .subscribe(
          receipt => {

            if (!!receipt.error) {
              this.showError(receipt.error);
              Log.error(new Error(receipt.error));
            }

            if (receipt.returnValue === 'False') {
              const sendFailedError = 'Sending tickets failed! Check the amount you are trying to send is correct.';
              this.showError(sendFailedError);
              Log.error(new Error(sendFailedError));
            }

            progressModal.close('ok');
            this.ticketBalanceRefreshRequested$.next([item]);
          },
          error => {
            this.showError(error);
            Log.error(error);
            progressModal.close('ok');
          }
        );
    });
  }


  send(item: SavedTicket) {

    const modal = this.modalService.open(SendTicketComponent, { backdrop: 'static', keyboard: false });
    (<SendTicketComponent>modal.componentInstance).walletName = this.walletName;
    (<SendTicketComponent>modal.componentInstance).selectedSenderAddress = this.selectedAddress;
    (<SendTicketComponent>modal.componentInstance).balance = this.balance;
    (<SendTicketComponent>modal.componentInstance).coinUnit = this.coinUnit;
    (<SendTicketComponent>modal.componentInstance).ticket = item;
    modal.result.then(value => {

      if (!value || !value.callResponse) {
        return;
      }

      // start monitoring ticket progress
      const progressModal = this.modalService.open(ProgressComponent, { backdrop: 'static', keyboard: false });
      (<ProgressComponent>progressModal.componentInstance).loading = true;
      (<ProgressComponent>progressModal.componentInstance).close.subscribe(() => progressModal.close());
      (<ProgressComponent>progressModal.componentInstance).title = 'Waiting For Confirmation';
      // tslint:disable-next-line:max-line-length
      (<ProgressComponent>progressModal.componentInstance).message = 'Your ticket transfer transaction has been broadcast and is waiting to be mined. This window will close once the transaction receives one confirmation.';
      (<ProgressComponent>progressModal.componentInstance).summary = `Send ${value.amount} ${item.name} to ${value.recipientAddress}`;

      const receiptQuery = this.smartContractsService.GetReceiptSilent(value.callResponse.transactionId)
        .pipe(
          catchError(error => {
            // Receipt API returns a 400 if the receipt is not found.
            Log.log(`Receipt not found yet`);
            return of(undefined);
          })
        );

      pollWithTimeOut(this.pollingInterval, this.maxTimeout, receiptQuery)
        .pipe(
          first(r => !!r),
          switchMap(result => {
            // Timeout returns null after completion, use this to throw an error to be handled by the subscriber.
            if (result === null) {
              return throwError(`It seems to be taking longer to transfer tickets. Please go to "Smart Contracts" tab
                to monitor transactions and check the progress of the ticket transfer.`);
            }

            return of(result);
          }),
          takeUntil(this.disposed$)
        )
        .subscribe(
          receipt => {

            if (!!receipt.error) {
              this.showError(receipt.error);
              Log.error(new Error(receipt.error));
            }

            if (receipt.returnValue === 'False') {
              const sendFailedError = 'Sending tickets failed! Check the amount you are trying to send is correct.';
              this.showError(sendFailedError);
              Log.error(new Error(sendFailedError));
            }

            progressModal.close('ok');
            this.ticketBalanceRefreshRequested$.next([item]);
          },
          error => {
            this.showError(error);
            Log.error(error);
            progressModal.close('ok');
          }
        );
    });
  }

  private updateTicketCollection(ticket: SavedTicket) {
    if (!ticket) { return; }

    const existingTicketIndex = this.tickets.map(t => t.address).indexOf(ticket.address);
    if (existingTicketIndex >= 0) {
      this.tickets.splice(existingTicketIndex, 1);
    }

    this.tickets.push(ticket);
  }
}
