import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { ClipboardModule } from 'ngx-clipboard';

import { TransactionComponent } from '../smart-contracts/components/modals/transaction/transaction.component';
import { SmartContractsModule } from '../smart-contracts/smart-contracts.module';
import { AddTicketComponent } from './components/add-ticket/add-ticket.component';
import { ProgressComponent } from './components/progress/progress.component';
import { SendTicketComponent } from './components/send-ticket/send-ticket.component';
import { BuyTicketComponent } from './components/buy-ticket/buy-ticket.component';
import { TicketsComponent } from './components/tickets.component';
import { Log } from './services/logger.service';
import { StorageService } from './services/storage.service';
import { TicketsService } from './services/tickets.service';
import { SmartContractsService } from '../smart-contracts/smart-contracts.service';

@NgModule({
  imports: [
    CommonModule, NgbModalModule, ClipboardModule, FormsModule, ReactiveFormsModule, SharedModule, SmartContractsModule.forRoot()
  ],

  providers: [TicketsService, StorageService, Log, SmartContractsService],

  declarations: [
    TicketsComponent,
    AddTicketComponent,
    SendTicketComponent,
    BuyTicketComponent,
    ProgressComponent
  ],

  entryComponents: [
    AddTicketComponent,
    SendTicketComponent,
    BuyTicketComponent,
    TransactionComponent,
    ProgressComponent
  ]
})
export class TicketsModule { }
