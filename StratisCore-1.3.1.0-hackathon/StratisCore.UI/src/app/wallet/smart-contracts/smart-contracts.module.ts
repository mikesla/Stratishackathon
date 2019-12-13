import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SmartContractsServiceBase, SmartContractsService } from './smart-contracts.service';
import { SmartContractsComponent } from './components/smart-contracts.component';
import { TransactionComponent } from './components/modals/transaction/transaction.component';
import { EventTransactionComponent } from './components/modals/event-transaction/event-transaction.component';
import { AddNewAddressComponent } from '../address-book/modals/add-new-address/add-new-address.component';
import { SharedModule } from '@shared/shared.module';
import { ScBalanceComponent } from './components/balance/balance.component';
import { ContractTypePipe } from './components/contract-type.pipe';
import { AddressSelectionComponent } from './components/address-selection/address-selection.component';

@NgModule({
    imports: [
        CommonModule, NgbModalModule, ClipboardModule, FormsModule, ReactiveFormsModule, SharedModule
    ],

    providers: [{ provide: SmartContractsServiceBase, useClass: SmartContractsService }],
    exports: [
        ScBalanceComponent
    ],
    declarations: [
        SmartContractsComponent,
        TransactionComponent,
        EventTransactionComponent,
        ScBalanceComponent,
        ContractTypePipe,
        AddressSelectionComponent
    ],

    entryComponents: [
        TransactionComponent, EventTransactionComponent,AddNewAddressComponent
    ]
})
export class SmartContractsModule {
    static forRoot(): ModuleWithProviders {
        return {
          ngModule: SmartContractsModule,
          providers: [
            { provide: SmartContractsServiceBase, useClass: SmartContractsService }
          ]
        };
    }
}
