import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Journal, JournalMark } from '../models/journal';
import { httpContextWithStudyPlace } from '@likdan/studyum-core';

@Injectable({
  providedIn: 'root',
})
export class MarksService {
  private http = inject(HttpClient);

  addMark(request: any): Observable<JournalMark> {
    return this.http.post<JournalMark>('api/journal/v1/marks', request, { context: httpContextWithStudyPlace() });
  }

  removeMark(markId: string, lessonId: string): Observable<void> {
    return this.http.delete<void>(`api/journal/v1/marks/${markId}`, {
      context: httpContextWithStudyPlace(),
      params: { lessonId: lessonId },
    });
  }

  editMark(request: any): Observable<void> {
    return this.http.put<void>('api/journal/v1/marks', request, { context: httpContextWithStudyPlace() });
  }
}
