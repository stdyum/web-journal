import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JournalViewService } from './journal-view.service';
import { switchMap } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Journal, JournalCell, JournalColumn, JournalRow } from '../../models/journal';
import { JournalCellComponent } from '../../components/journal-cell/journal-cell.component';
import { JournalColumnCellComponent } from '../../components/journal-column-cell/journal-column-cell.component';
import { MatButton } from '@angular/material/button';
import { TranslationPipe, TranslationService } from '@likdan/studyum-core';

@Component({
  selector: 'journal-view',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    JournalCellComponent,
    JournalColumnCellComponent,
    MatButton,
    TranslationPipe,
  ],
  templateUrl: './journal-view.component.html',
  styleUrl: './journal-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalViewComponent {
  cells: [string, string][] = [];

  private service = inject(JournalViewService);
  private route = inject(ActivatedRoute);
  journal$ = this.route.queryParams
    .pipe(switchMap(p => this.service.getJournal(p)));
  private translation = inject(TranslationService);

  cellsTemplateArea(journal: Journal): string {
    const areas: string[][] = new Array(journal.rows.length).fill([])
      .map(() => new Array(journal.columns.length).fill(''));

    journal.columns.forEach((c, ci) => {
      journal.rows.forEach((r, ri) => {
        areas[ri][ci] = this.columnRowArea(r.id, c.id);
        this.cells.push([r.id, c.id]);
      });
    });

    const columnsArea = `"fill ${journal.columns.map(c => `col${c.id}`).join(' ')}"`;
    const rowsArea = journal.rows.map(c => `row${c.id}`);
    return columnsArea + '\n' + areas.map((a, i) => `"${rowsArea[i]} ${a.join(' ')}"`).join('\n');
  }

  columnArea(column: JournalColumn): string {
    return `col${column.id}`;
  }

  rowArea(row: JournalRow): string {
    return `row${row.id}`;
  }

  cellArea(cell: JournalCell): string {
    return this.columnRowArea(cell.point.rowId, cell.point.columnId);
  }

  canEdit(journal: Journal): boolean {
    return journal.info.type === 'group';
  }

  getCell(cell: [string, string]): JournalCell {
    return {
      point: {
        rowId: cell[0],
        columnId: cell[1],
      },
      marks: [],
    };
  }

  removeEmptyCell(cell: [string, string]): string {
    this.cells = this.cells.filter(a => a[0] !== cell[0] && a[1] !== cell[1]);
    return this.columnRowArea(cell[0], cell[1]);
  }

  generateReport(): void {
    const styles = `
      body {
          all: unset;
          display: grid;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin: 0 16px;
      }

      h1 {
        grid-row: 1;
        grid-column: 2;
      }

      .reports, journal-column-cell button, .add-mark{
        display: none !important;
      }

      .fill {
        width: auto;
      }

      main > * {
        width: 100%;
        border: 1px solid black;
      }

      journal-cell {
        background: unset !important;
        display: flex;
        gap: 8px;
        height: 50px;
        width: fit-content;
        border-radius: var(--border-radius2);
      }

      journal-cell div {
        background: unset !important;
        display: grid;
        place-items: center;
        height: 100%;
        border-radius: var(--border-radius1);
      }

      main span {
        display: flex;
        align-items: center;
        height: 50px;
        padding: 0 8px;
        width: auto;
      }

      main journal-column-cell {
        display: grid;
        place-items: center;
        font-variant-numeric: tabular-nums;
        width: auto;
      }

      journal-cell {
        min-width: 125px;
        width: fit-content;
        padding: 0 8px;
      }

      main {
        display: grid;
        grid-template-columns: min-content;
        grid-template-rows: min-content;
        width: max-content;
        border: 1px solid black;
      }
    `;
    const html = document.getElementsByTagName('journal-view')[0].innerHTML;

    const htmlWithStyles = `
    <style>${styles}</style>
    <h1>${this.translation.getTranslation('report_header')()}</h1>
    ${html}
    `;

    const win = window.open('', '_blank', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
    if (!win) return;

    win.document.body.innerHTML = htmlWithStyles;
  }

  private columnRowArea(columnId: string, rowId: string): string {
    return 'area' + columnId.replaceAll(/[^a-zA-Z0-9]/g, '') + rowId.replaceAll(/[^a-zA-Z0-9]/g, '');
  }
}
