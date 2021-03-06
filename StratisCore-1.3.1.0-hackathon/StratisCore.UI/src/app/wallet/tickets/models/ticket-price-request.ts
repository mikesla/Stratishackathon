export class TicketPriceRequest {
    contractAddress: string;
    sender: string;
    methodName = '';
    amount = 0;
    gasPrice = 100;
    gasLimit = 100000;
    parameters: string[] = [];

    constructor(ticketAddress: string, senderAddress: string, methodName: string) {
        this.contractAddress = ticketAddress;
        this.sender = senderAddress;
        this.methodName = methodName;
        //this.parameters.push(`9#${senderAddress}`);
    }
}
