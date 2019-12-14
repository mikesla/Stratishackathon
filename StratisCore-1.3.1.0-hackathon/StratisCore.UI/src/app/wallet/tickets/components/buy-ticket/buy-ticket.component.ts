import { Component, OnInit, Input } from '@angular/core';
import { SavedTicket } from '../../models/ticket';
import { FormControl, FormArray, Validators, FormGroup } from '@angular/forms';
import { Mixin } from '../../models/mixin';
import { Disposable } from '../../models/disposable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartContractsService } from 'src/app/wallet/smart-contracts/smart-contracts.service';
import { TicketPriceRequest } from '../../models/ticket-price-request';
import { catchError, first, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { forkJoin, interval, Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { Log } from '../../services/logger.service';
import { ModalService } from '@shared/services/modal.service';
import { TicketsService } from '../../services/tickets.service';
import { Ticket } from '../../models/ticket';



@Component({
    selector: 'app-buy-ticket',
    templateUrl: './buy-ticket.component.html',
    styleUrls: ['./buy-ticket.component.css']
})
@Mixin([Disposable])
export class BuyTicketComponent implements OnInit {

    @Input()
    selectedSenderAddress: string;

    @Input()
    ticket: SavedTicket;

    @Input()
    walletName: string;

    balance = 0;

    title: string;

    parameters: FormArray;
    feeAmount: FormControl;
    gasPrice: FormControl;
    gasLimit: FormControl;
    contractAddress: FormControl;
    recipientAddress: FormControl;
    password: FormControl;
    coinUnit: string;
    loading: boolean;
    apiError: string;

    recommendedGasLimit = 15000;
    gasCallLimitMinimum = 10000;
    gasLimitMaximum = 100000;
    gasPriceMinimum = 1;
    gasPriceMaximum = 10000;
    transactionForm: FormGroup;
    ticketAmount: FormControl;
    amount: FormControl;

    ticketPrice= 0;

    constructor(private activeModal: NgbActiveModal, private smartContractsService: SmartContractsService, private genericModalService: ModalService, private ticketService: TicketsService)
    {

    }

    ngOnInit() {
        this.title = 'Buy ticket ' + this.ticket.ticker;
        this.registerControls();
        this.contractAddress.setValue(this.ticket.address);
        this.contractAddress.disable();

        this.ticketService.GetTicketPrice(new TicketPriceRequest(this.contractAddress.value, this.selectedSenderAddress))
            .pipe(
                catchError(error => {
                    this.showApiError(`Error retrieving price. ${error}`);
                    return of(0);
                }),
                take(1)
            )
            .subscribe(ticketPrice => this.setTicketPrice(ticketPrice));

    }

    setTicketPrice(ticketPrice: number) {
        this.ticketPrice=ticketPrice/100000000;
    }

    private updateTicketPrice(tickets: SavedTicket[]) {


    }


    showApiError(error: string) {
        this.genericModalService.openModal('Error', error);
    }

    closeClicked() {
        this.activeModal.close();
    }

    private createModel() {

        return {
            amount: this.amount.value,
            contractAddress: this.ticket.address,
            feeAmount: this.feeAmount.value,
            gasPrice: this.gasPrice.value,
            gasLimit: this.gasLimit.value,
            parameters: [

            ],
            methodName: 'BuyTicket',
            password: this.password.value,
            walletName: this.walletName,
            sender: this.selectedSenderAddress,
        };
    }

    onSubmit() {
        // Hack the parameters into a format the API expects
        const result = this.createModel();

        this.loading = true;

        this.title = 'Buying ticket ' + this.ticket.ticker + '...';

        // We don't need an observable here so let's treat it as a promise.
        this.smartContractsService.PostCall(result)
            .toPromise()
            .then(callResponse => {
                this.loading = false;
                this.activeModal.close({ request: result, callResponse, amount: 1, recipientAddress: this.selectedSenderAddress });
            },
                error => {
                    this.loading = false;
                    if (!error.error.errors) {
                        if (error.error.value.message) {
                            this.apiError = error.error.value.message;
                        } else {
                            console.log(error);
                        }
                    } else {
                        this.apiError = error.error.errors[0].message;
                    }
                });
    }

    setTicketAmount(ticketBalance: number) {
        this.ticketAmount.setValue(ticketBalance);
    }

    private registerControls() {
        const amountValidator = control => Number(control.value) > this.balance ? { amountError: true } : null;
        const gasPriceTooLowValidator = control => Number(control.value) < this.gasPriceMinimum ? { gasPriceTooLowError: true } : null;
        const gasPriceTooHighValidator = control => Number(control.value) > this.gasPriceMaximum ? { gasPriceTooHighError: true } : null;
        const gasLimitMaximumValidator = control => Number(control.value) > this.gasLimitMaximum ? { gasLimitTooHighError: true } : null;
        // tslint:disable-next-line:max-line-length
        const gasCallLimitMinimumValidator = control => Number(control.value) < this.gasCallLimitMinimum ? { gasCallLimitTooLowError: true } : null;

        const integerValidator = Validators.pattern('^[0-9][0-9]*$');

        const gasLimitValidator = (gasCallLimitMinimumValidator);

        this.ticketAmount = new FormControl(0, []);
       // this.ticketPrice = new FormControl(0, []);
        this.amount = new FormControl(1, []);
        this.feeAmount = new FormControl(0.001, [Validators.required, amountValidator, Validators.min(0)]);
        // tslint:disable-next-line:max-line-length
        this.gasPrice = new FormControl(100, [Validators.required, integerValidator, Validators.pattern('^[+]?([0-9]{0,})*[.]?([0-9]{0,2})?$'), gasPriceTooLowValidator, gasPriceTooHighValidator, Validators.min(0)]);
        // tslint:disable-next-line:max-line-length
        this.gasLimit = new FormControl(this.recommendedGasLimit, [Validators.required, integerValidator, Validators.pattern('^[+]?([0-9]{0,})*[.]?([0-9]{0,2})?$'), gasLimitValidator, gasLimitMaximumValidator, Validators.min(0)]);
        this.parameters = new FormArray([]);
        this.password = new FormControl('', [Validators.required, Validators.nullValidator]);
        this.contractAddress = new FormControl('', [Validators.required, Validators.nullValidator]);
        this.recipientAddress = new FormControl('', []);
        this.transactionForm = new FormGroup({
            feeAmount: this.feeAmount,
            gasPrice: this.gasPrice,
            gasLimit: this.gasLimit,
            parameters: this.parameters,
            ticketAmount: this.ticketAmount,
            contractAddress: this.contractAddress,
            recipientAddress: this.recipientAddress,
            password: this.password,
            amount: this.amount,
           // ticketPrice: this.ticketPrice
        });
    }
}
