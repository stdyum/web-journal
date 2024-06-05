import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { JournalColumn } from '../../models/journal';
import { MatButton } from '@angular/material/button';
import { JournalColumnCellService } from './journal-column-cell.service';
import { MatDialog } from '@angular/material/dialog';
import { LessonInfoDialogComponent } from '../../dialogs/lesson-info-dialog/lesson-info-dialog.component';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'journal-column-cell',
  standalone: true,
  imports: [
    MatButton,
  ],
  templateUrl: './journal-column-cell.component.html',
  styleUrl: './journal-column-cell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalColumnCellComponent {
  column = input<JournalColumn | null>();
  canEdit = input<boolean>(false);

  private service = inject(JournalColumnCellService);
  private dialog = inject(MatDialog);

  editLessonInfo(column: JournalColumn, canEdit: boolean): void {
    let exists = false;
    this.service.getLessonInfo(column.id)
      .pipe(tap(() => exists = true))
      .pipe(switchMap(info => this.dialog.open(LessonInfoDialogComponent, {
          data: { initial: info, canEdit: canEdit },
        }).afterClosed()),
      )
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => exists ? this.service.editLessonInfo(v) : this.service.addLessonInfo(v)))
      .subscribe();
  }
}
