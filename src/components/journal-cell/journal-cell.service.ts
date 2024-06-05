import { inject, Injectable } from '@angular/core';
import { MarksService } from '../../services/marks.service';
import { Observable } from 'rxjs';
import { JournalMark } from '../../models/journal';

@Injectable({
  providedIn: 'root',
})
export class JournalCellService {
  private marksService = inject(MarksService);

  addMark(request: any): Observable<JournalMark> {
    return this.marksService.addMark(request);
  }

  removeMark(markId: string, lessonId: string): Observable<void> {
    return this.marksService.removeMark(markId, lessonId);
  }

  editMark(request: any): Observable<void> {
    return this.marksService.editMark(request);
  }
}
