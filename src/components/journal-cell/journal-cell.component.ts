import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { JournalCell, JournalMark } from '../../models/journal';
import { MarkDialogComponent } from '../../dialogs/mark-dialog/mark-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { JournalCellService } from './journal-cell.service';
import { filter, map, switchMap, take } from 'rxjs';

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

  private service = inject(JournalCellService);
  private dialog = inject(MatDialog);

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
      .subscribe();
  }

  editMark(cell: JournalCell, mark: JournalMark): void {
    this.dialog.open(MarkDialogComponent, { data: mark })
      .afterClosed()
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => v.type === 'remove' ?
        this.service.removeMark(mark.id, cell.point.columnId) :
        this.service.editMark({
          id: mark.id,
          mark: v.value.mark,
          studentId: cell.point.rowId,
          lessonId: cell.point.columnId,
        })))
      .pipe(take(1))
      .subscribe();
  }
}
