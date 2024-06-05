import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JournalViewService } from './journal-view.service';
import { startWith, switchMap } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Journal, JournalCell } from '../../models/journal';
import { JournalCellComponent } from '../../components/journal-cell/journal-cell.component';
import { JournalColumnCellComponent } from '../../components/journal-column-cell/journal-column-cell.component';

@Component({
  selector: 'journal-view',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    JournalCellComponent,
    JournalColumnCellComponent,
  ],
  templateUrl: './journal-view.component.html',
  styleUrl: './journal-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalViewComponent {
  private service = inject(JournalViewService);

  private route = inject(ActivatedRoute);

  journal$ = this.route.queryParams
    .pipe(switchMap(p => this.service.getJournal(p)));

  cellsTemplateArea(journal: Journal): string {
    const areas: string[][] = new Array(journal.columns.length).fill([])
      .map(() => new Array(journal.rows.length).fill(''));

    journal.columns.forEach((c, ci) => {
      journal.rows.forEach((r, ri) => {
        areas[ci][ri] = this.columnRowArea(r.id, c.id);
      });
    });

    return areas.map(a => '"' + a.join(' ') + '"').join('\n');
  }

  cellArea(cell: JournalCell): string {
    return this.columnRowArea(cell.point.rowId, cell.point.columnId);
  }

  canEdit(journal: Journal): boolean {
    return journal.info.type === 'group';
  }

  private columnRowArea(columnId: string, rowId: string): string {
    return columnId.replaceAll(/[^a-zA-Z0-9]/g, '') + rowId.replaceAll(/[^a-zA-Z0-9]/g, '');
  }
}
