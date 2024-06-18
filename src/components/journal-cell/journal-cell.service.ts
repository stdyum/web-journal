import { inject, Injectable } from '@angular/core';
import { MarksService } from '../../services/marks.service';
import { Observable } from 'rxjs';
import { JournalAbsence, JournalMark } from '../../models/journal';
import { AbsencesService } from '../../services/absences.service';

@Injectable({
  providedIn: 'root',
})
export class JournalCellService {
  private marksService = inject(MarksService);
  private absencesService = inject(AbsencesService);

  addMark(request: any): Observable<JournalMark> {
    return this.marksService.addMark(request);
  }

  removeMark(markId: string, lessonId: string): Observable<void> {
    return this.marksService.removeMark(markId, lessonId);
  }

  editMark(request: any): Observable<void> {
    return this.marksService.editMark(request);
  }

  addAbsence(request: any): Observable<JournalAbsence> {
    return this.absencesService.addAbsence(request);
  }

  removeAbsence(markId: string, lessonId: string): Observable<void> {
    return this.absencesService.removeAbsence(markId, lessonId);
  }

  editAbsence(request: any): Observable<void> {
    return this.absencesService.editAbsence(request);
  }
}
