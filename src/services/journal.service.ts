import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpContextWithStudyPlace } from '@likdan/studyum-core';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';
import { Journal } from '../models/journal';

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  private http = inject(HttpClient);

  getJournal(params: Params): Observable<Journal> {
    return this.http.get<Journal>('api/journal/v1/journal', { params: params, context: httpContextWithStudyPlace() });
  }
}
