import { Injectable } from '@angular/core';
import { LocalExecutionResult } from '@shared/models/local-execution-result';
import { ApiService } from '@shared/services/api.service';
import { GlobalService } from '@shared/services/global.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocalCallRequest } from '../models/LocalCallRequest';
import { Result, ResultStatus } from '../models/result';
import { SavedTicket, Ticket } from '../models/ticket';
import { TicketBalanceRequest } from '../models/ticket-balance-request';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private savedTickets = 'savedTickets';
  private defaultTickets = [];

  constructor(private apiService: ApiService, private storage: StorageService, private globalService: GlobalService) {
    this.savedTickets = `${globalService.getNetwork()}:savedTickets`;

    // Upgrade wallets using the old format
    const oldTickets = this.storage.getItem<SavedTicket[]>('savedTickets');
    if (oldTickets) {
      this.UpdateTickets(oldTickets);
      this.storage.removeItem('savedTickets');
    }
   }

  GetSavedTickets(): SavedTicket[] {
    const storedTickets = this.storage.getItem<SavedTicket[]>(this.savedTickets);
    return !!storedTickets ? [...this.defaultTickets, ...storedTickets] : [...this.defaultTickets];
  }

  GetAvailableTickets(): Ticket[] {
    return [
      new Ticket('CG1', 'CXa9fNVXPfYL9rdqiR22NoAc9kZUfBAUCu', 'Cirrus Giveaway'),
      ...this.defaultTickets
    ];
  }

  UpdateTickets(tickets: SavedTicket[]): Result<SavedTicket[]> {
    this.storage.setItem(this.savedTickets, tickets);
    return Result.ok(tickets);
  }

  AddTicket(ticket: SavedTicket): Result<SavedTicket> {
    if (!ticket) { return new Result(ResultStatus.Error, 'Invalid ticket'); }
    const tickets = this.GetSavedTickets() || [];

    const index = tickets.map(t => t.address).indexOf(ticket.address);
    if (index >= 0) { return new Result(ResultStatus.Error, 'Specified ticket is already saved'); }

    tickets.push(ticket);
    this.storage.setItem(this.savedTickets, tickets);
    return Result.ok(ticket);
  }

  RemoveTicket(ticket: SavedTicket): Result<SavedTicket> {
    if (!ticket) { return new Result(ResultStatus.Error, 'Invalid ticket'); }
    const tickets = this.GetSavedTickets() || [];
    const index = tickets.map(t => t.address).indexOf(ticket.address);
    if (index < 0) { return new Result(ResultStatus.Error, 'Specified ticket was not found'); }
    tickets.splice(index, 1);
    this.storage.setItem(this.savedTickets, tickets);
    return Result.ok(ticket);
  }

  GetTicketBalance(request: TicketBalanceRequest): Observable<number> {
    return this.LocalCall(request).pipe(
      map(localExecutionresult => localExecutionresult.return ? localExecutionresult.return : 0)
    );
  }

  LocalCall(request: LocalCallRequest): Observable<LocalExecutionResult> {
    return this.apiService.localCall(request)
      .pipe(
        map(response => {
          // Temporary workaround for non-camel-cased API response
          const anyResponse = (<any>response);
          const result = new LocalExecutionResult();
          result.gasConsumed = anyResponse.hasOwnProperty('GasConsumed') ? anyResponse.GasConsumed : anyResponse.gasConsumed;
          result.return = anyResponse.hasOwnProperty('Return') ? anyResponse.Return : anyResponse.return;
          result.revert = anyResponse.hasOwnProperty('Revert') ? anyResponse.Revert : anyResponse.revert;
          result.logs = anyResponse.hasOwnProperty('Logs') ? anyResponse.Revert : anyResponse.logs;
          result.internalTransfers = anyResponse.hasOwnProperty('InternalTransfers') ? anyResponse.Revert : anyResponse.internalTransfers;
          return result;
        })
      );
  }
}
