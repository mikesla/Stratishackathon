export class TicketBalanceRequest {
    contractAddress: string;
    sender: string;
    methodName = 'GetBalance';
    amount = 0;
    gasPrice = 100;
    gasLimit = 100000;
    parameters: string[] = [];

    constructor(ticketAddress: string, senderAddress: string) {
        this.contractAddress = ticketAddress;
        this.sender = senderAddress;
        this.parameters.push(`9#${senderAddress}`);
    }
}
