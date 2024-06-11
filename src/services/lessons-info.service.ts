import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { filter, map, Observable } from 'rxjs';
import { httpContextWithStudyPlace } from '@likdan/studyum-core';
import { LessonInfo } from '../models/lessons-info';

@Injectable({
  providedIn: 'root',
})
export class LessonsInfoService {
  private http = inject(HttpClient);

  getLessonInfo(id: string): Observable<LessonInfo | null> {
    return this.http.get<LessonInfo>(`api/journal/v1/lessons/info/${id}`, {
      observe: 'events',
      context: httpContextWithStudyPlace(),
    })
      .pipe(map(r => {
        if (r instanceof HttpErrorResponse) throw r.error;
        if (r instanceof HttpResponse) return r.body;

        return null
      }))
      .pipe(filter(v => !!v));
  }

  addLessonInfo(request: any): Observable<LessonInfo> {
    return this.http.post<LessonInfo>(`api/journal/v1/lessons/info`, request, {
      context: httpContextWithStudyPlace(),
    });
  }

  editLessonInfo(request: any): Observable<void> {
    return this.http.put<void>(`api/journal/v1/lessons/info`, request, {
      context: httpContextWithStudyPlace(),
    });
  }
}
