import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@shared/services/modal.service';
import { ReplaySubject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

import { Disposable } from '../../models/disposable';
import { LocalCallRequest } from '../../models/LocalCallRequest';
import { Mixin } from '../../models/mixin';
import { SavedTicket, Ticket } from '../../models/ticket';
import { TicketsService } from '../../services/tickets.service';

@Component({
    selector: 'app-add-ticket',
    templateUrl: './add-ticket.component.html',
    styleUrls: ['./add-ticket.component.css']
})
@Mixin([Disposable])
export class AddTicketComponent implements OnInit, OnDestroy, Disposable {

    @Input()
    selectedSenderAddress: string;


    @Input() tickets: Ticket[] = [];
    addTicketForm: FormGroup;
    balance = 0;
    ticket: FormControl;
    address: FormControl;
    ticker: FormControl;
    name: FormControl;
    loading: boolean;
    apiError: string;
    disposed$ = new ReplaySubject<boolean>();
    dispose: () => void;

    constructor(
        private ticketService: TicketsService,
        private activeModal: NgbActiveModal,
        private genericModalService: ModalService) {
        this.registerControls();
    }

    get customTicketSelected() {
        return !!this.addTicketForm && !!this.addTicketForm.get('ticket').value && this.addTicketForm.get('ticket').value.toLowerCase() === 'custom';
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.dispose();
    }

    closeClicked() {
        this.activeModal.close();
    }

    onSubmit() {

        const ticker = this.customTicketSelected ? this.ticker.value + '' : this.tickets.find(t => t.address === this.ticket.value).ticker;
        const address = this.customTicketSelected ? this.address.value + '' : this.tickets.find(t => t.address === this.ticket.value).address;
        const name = this.customTicketSelected ? this.name.value + '' : this.tickets.find(t => t.address === this.ticket.value).name;

        // Check that this ticket isn't already in the list
        const addedTickets = this.ticketService.GetSavedTickets().find(ticket => ticket.address === address);

        if (addedTickets) {
            this.showApiError(`Event ${ticker} is already added`);

            return;
        }

        // Sender doesn't matter here, just reuse an easily available address
        const tickerCall = new LocalCallRequest(address, this.selectedSenderAddress, 'Symbol');

        this.loading = true;

        // Add the ticket if valid ticket contract exists
        this.ticketService
            .LocalCall(tickerCall)
            .pipe(
                take(1),
                takeUntil(this.disposed$),
                finalize(() => this.loading = false)
            )
            .subscribe(localExecutionResult => {
                const methodCallResult = localExecutionResult.return;

                if (!methodCallResult) {
                    this.showApiError(`Address is not a valid event contract.`);
                    return;
                }

                if (typeof (methodCallResult) === 'string' && methodCallResult !== ticker) {
                    this.showApiError(`Ticket contract symbol ${methodCallResult} does not match given symbol ${ticker}.`);
                    return;
                }

                const savedTicket = new SavedTicket(ticker, address, 0, name);
                const result = this.ticketService.AddTicket(savedTicket);

                if (result.failure) {
                    this.apiError = result.message;
                    return;
                }

                this.activeModal.close(savedTicket);
            });
    }

    showApiError(error: string) {
        this.genericModalService.openModal('Error', error);
    }

    private registerControls() {
        const customTicketDetailsValidator = control => !control.value && this.customTicketSelected ? { required: true } : null;

        this.ticket = new FormControl(0, [Validators.required]);
        this.address = new FormControl('', [customTicketDetailsValidator]);
        this.ticker = new FormControl('', [customTicketDetailsValidator]);
        this.name = new FormControl('', [customTicketDetailsValidator]);

        this.addTicketForm = new FormGroup({
            ticket: this.ticket,
            address: this.address,
            ticker: this.ticker,
            name: this.name
        });
    }
}
