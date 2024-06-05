import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JournalService } from '../../services/journal.service';
import { Journal } from '../../models/journal';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class JournalViewService {
  private journalService = inject(JournalService);

  getJournal(params: Params): Observable<Journal> {
    return this.journalService.getJournal(params);
  }
}
