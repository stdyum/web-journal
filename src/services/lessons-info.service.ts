import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { httpContextWithStudyPlace } from '@likdan/studyum-core';
import { LessonInfo } from '../models/lessons-info';

@Injectable({
  providedIn: 'root',
})
export class LessonsInfoService {
  private http = inject(HttpClient);

  getLessonInfo(id: string): Observable<LessonInfo> {
    return this.http.get<LessonInfo>(`api/journal/v1/lessons/info/${id}`, {
      observe: 'response',
    })
      .pipe(map(r => {
        if (r.status >= 400) throw r;
        return r.body!;
      }));
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
