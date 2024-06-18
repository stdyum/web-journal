import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { JournalAbsence, JournalCell, JournalMark } from '../../models/journal';
import { MarkDialogComponent } from '../../dialogs/mark-dialog/mark-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { JournalCellService } from './journal-cell.service';
import { filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { AbsenceDialogComponent } from '../../dialogs/absence-dialog/absence-dialog.component';
import { TranslationPipe } from '@likdan/studyum-core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'journal-cell',
  standalone: true,
  imports: [
    TranslationPipe,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './journal-cell.component.html',
  styleUrl: './journal-cell.component.css',
  host: {
    class: 'accent-container',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalCellComponent {
  cell = input<JournalCell | null>(null);
  canEditMarks = input<boolean>(false);

  marks = signal<JournalMark[]>([]);
  absences = signal<JournalAbsence[]>([]);

  private service = inject(JournalCellService);
  private dialog = inject(MatDialog);

  constructor() {
    effect(() => this.marks.set(this.cell()?.marks ?? []), {
      allowSignalWrites: true,
    });
    effect(() => this.absences.set(this.cell()?.absences ?? []), {
      allowSignalWrites: true,
    });
  }

  addMark(cell: JournalCell): void {
    this.dialog.open(MarkDialogComponent)
      .afterClosed()
      .pipe(map(v => v?.value))
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.service.addMark({
        mark: v.mark,
        studentId: cell.point.rowId,
        lessonId: cell.point.columnId,
      })))
      .pipe(take(1))
      .pipe(tap(m => this.marks.update(marks => [...marks, m])))
      .subscribe();
  }

  showMarkDialog(cell: JournalCell, mark: JournalMark): void {
    this.dialog.open(MarkDialogComponent, { data: mark })
      .afterClosed()
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => v.type === 'remove' ?
        this.removeMark(cell, mark) :
        this.editMark(cell, mark, v.value.mark)))
      .pipe(take(1))
      .subscribe();
  }

  editMark(cell: JournalCell, mark: JournalMark, newMark: string): Observable<void> {
    return this.service.editMark({
      id: mark.id,
      mark: newMark,
      studentId: cell.point.rowId,
      lessonId: cell.point.columnId,
    })
      .pipe(tap(() => this.marks.update(marks => {
        marks[marks.indexOf(mark)].mark = newMark;
        return [...marks];
      })));
  }

  removeMark(cell: JournalCell, mark: JournalMark): Observable<void> {
    return this.service.removeMark(mark.id, cell.point.columnId)
      .pipe(tap(() => this.marks.update(marks => marks.filter(m => m.id !== mark.id))));
  }

  addAbsence(cell: JournalCell): void {
    this.dialog.open(AbsenceDialogComponent)
      .afterClosed()
      .pipe(map(v => v?.value))
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.service.addAbsence({
        absence: v.absence,
        studentId: cell.point.rowId,
        lessonId: cell.point.columnId,
      })))
      .pipe(take(1))
      .pipe(tap(a => this.absences.update(absences => [...absences, a])))
      .subscribe();
  }

  showAbsenceDialog(cell: JournalCell, absence: JournalAbsence): void {
    this.dialog.open(AbsenceDialogComponent, { data: absence })
      .afterClosed()
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => v.type === 'remove' ?
        this.removeAbsence(cell, absence) :
        this.editAbsence(cell, absence, v.value.absence)))
      .pipe(take(1))
      .subscribe();
  }

  editAbsence(cell: JournalCell, absence: JournalAbsence, newAbsence: number): Observable<void> {
    return this.service.editAbsence({
      id: absence.id,
      absence: newAbsence,
      studentId: cell.point.rowId,
      lessonId: cell.point.columnId,
    })
      .pipe(tap(() => this.absences.update(absences => {
        absences[absences.indexOf(absence)].absence = newAbsence;
        return [...absences];
      })));
  }

  removeAbsence(cell: JournalCell, absence: JournalAbsence): Observable<void> {
    return this.service.removeAbsence(absence.id, cell.point.columnId)
      .pipe(tap(() => this.absences.update(marks => marks.filter(m => m.id !== absence.id))));
  }
}
