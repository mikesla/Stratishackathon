import { Component, OnInit, Input } from '@angular/core';
import { SavedTicket } from '../../models/ticket';
import { FormControl, FormArray, Validators, FormGroup } from '@angular/forms';
import { Mixin } from '../../models/mixin';
import { Disposable } from '../../models/disposable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartContractsService } from 'src/app/wallet/smart-contracts/smart-contracts.service';


@Component({
    selector: 'app-distribute-reward',
    templateUrl: './distribute-reward.component.html',
    styleUrls: ['./distribute-reward.component.css']
})
@Mixin([Disposable])
export class DistributeRewardComponent implements OnInit {

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

    fromId: FormControl;
    toId: FormControl;

    


    constructor(private activeModal: NgbActiveModal, private smartContractsService: SmartContractsService)
    {
 

    
    }

 

    ngOnInit() {
        this.title = 'Distribute rewards ' + this.ticket.ticker;
        this.registerControls();
        this.contractAddress.setValue(this.ticket.address);
        this.contractAddress.disable();
    }

    closeClicked() {
        this.activeModal.close();
    }

    private createModel() {

        return {
            amount: 0,
            contractAddress: this.ticket.address,
            feeAmount: this.feeAmount.value,
            gasPrice: this.gasPrice.value,
            gasLimit: this.gasLimit.value,
            parameters: [
                `7#${this.fromId.value}`,
                `7#${this.toId.value}`
            ],
            methodName: 'DistributeOverbids',
            password: this.password.value,
            walletName: this.walletName,
            sender: this.selectedSenderAddress
        };
    }

    onSubmit() {
        // Hack the parameters into a format the API expects
        const result = this.createModel();

        this.loading = true;

        this.title = 'Distributing  rewards and overbided funds ' + this.ticket.ticker + '...';

        // We don't need an observable here so let's treat it as a promise.
        this.smartContractsService.PostCall(result)
            .toPromise()
            .then(callResponse => {
                this.loading = false;
                this.activeModal.close({ request: result, callResponse, toId: this.toId.value, fromId: this.fromId.value });
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



    private registerControls() {
        const amountValidator = control => Number(control.value) > this.balance ? { amountError: true } : null;
        const gasPriceTooLowValidator = control => Number(control.value) < this.gasPriceMinimum ? { gasPriceTooLowError: true } : null;
        const gasPriceTooHighValidator = control => Number(control.value) > this.gasPriceMaximum ? { gasPriceTooHighError: true } : null;
        const gasLimitMaximumValidator = control => Number(control.value) > this.gasLimitMaximum ? { gasLimitTooHighError: true } : null;
        // tslint:disable-next-line:max-line-length
        const gasCallLimitMinimumValidator = control => Number(control.value) < this.gasCallLimitMinimum ? { gasCallLimitTooLowError: true } : null;

        const integerValidator = Validators.pattern('^[0-9][0-9]*$');

        const gasLimitValidator = (gasCallLimitMinimumValidator);


        this.fromId = new FormControl(1, [Validators.required, Validators.min(1)]);
        this.toId = new FormControl(10, [Validators.required, Validators.min(1)]);
        this.feeAmount = new FormControl(0.001, [Validators.required, amountValidator, Validators.min(0)]);
        // tslint:disable-next-line:max-line-length
        this.gasPrice = new FormControl(100, [Validators.required, integerValidator, Validators.pattern('^[+]?([0-9]{0,})*[.]?([0-9]{0,2})?$'), gasPriceTooLowValidator, gasPriceTooHighValidator, Validators.min(0)]);
        // tslint:disable-next-line:max-line-length
        this.gasLimit = new FormControl(this.recommendedGasLimit, [Validators.required, integerValidator, Validators.pattern('^[+]?([0-9]{0,})*[.]?([0-9]{0,2})?$'), gasLimitValidator, gasLimitMaximumValidator, Validators.min(0)]);
        this.parameters = new FormArray([]);
        this.password = new FormControl('', [Validators.required, Validators.nullValidator]);
        this.contractAddress = new FormControl('', [Validators.required, Validators.nullValidator]);
        this.transactionForm = new FormGroup({
            feeAmount: this.feeAmount,
            gasPrice: this.gasPrice,
            gasLimit: this.gasLimit,
            parameters: this.parameters,
          
            contractAddress: this.contractAddress,
            
            password: this.password,
            fromId: this.fromId,
            toId: this.toId
        });
    }
}
