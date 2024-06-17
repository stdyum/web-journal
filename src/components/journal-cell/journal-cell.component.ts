import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { JournalCell, JournalMark } from '../../models/journal';
import { MarkDialogComponent } from '../../dialogs/mark-dialog/mark-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { JournalCellService } from './journal-cell.service';
import { filter, map, Observable, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'journal-cell',
  standalone: true,
  imports: [],
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

  private service = inject(JournalCellService);
  private dialog = inject(MatDialog);

  constructor() {
    effect(() => this.marks.set(this.cell()?.marks ?? []), {
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
}
