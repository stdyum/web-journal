import { inject, Injectable } from '@angular/core';
import { MarksService } from '../../services/marks.service';
import { Observable } from 'rxjs';
import { JournalMark } from '../../models/journal';
import { LessonsInfoService } from '../../services/lessons-info.service';
import { LessonInfo } from '../../models/lessons-info';

@Injectable({
  providedIn: 'root'
})
export class JournalColumnCellService {
  private lessonsInfo = inject(LessonsInfoService);

  getLessonInfo(id: string): Observable<LessonInfo | null> {
    return this.lessonsInfo.getLessonInfo(id)
  }

  addLessonInfo(request: any): Observable<LessonInfo> {
    return this.lessonsInfo.addLessonInfo(request);
  }


  editLessonInfo(request: any): Observable<void> {
    return this.lessonsInfo.editLessonInfo(request);
  }
}
