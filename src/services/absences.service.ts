import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Journal, JournalAbsence, JournalMark } from '../models/journal';
import { httpContextWithStudyPlace } from '@likdan/studyum-core';

@Injectable({
  providedIn: 'root',
})
export class AbsencesService {
  private http = inject(HttpClient);

  addAbsence(request: any): Observable<JournalAbsence> {
    return this.http.post<JournalAbsence>('api/journal/v1/absences', request, { context: httpContextWithStudyPlace() });
  }

  removeAbsence(markId: string, lessonId: string): Observable<void> {
    return this.http.delete<void>(`api/journal/v1/absences/${markId}`, {
      context: httpContextWithStudyPlace(),
      params: { lessonId: lessonId },
    });
  }

  editAbsence(request: any): Observable<void> {
    return this.http.put<void>('api/journal/v1/absences', request, { context: httpContextWithStudyPlace() });
  }
}
