import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JournalViewService } from './journal-view.service';
import { switchMap } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Journal, JournalCell } from '../../models/journal';
import { JournalCellComponent } from '../../components/journal-cell/journal-cell.component';
import { JournalColumnCellComponent } from '../../components/journal-column-cell/journal-column-cell.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'journal-view',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    JournalCellComponent,
    JournalColumnCellComponent,
    MatButton,
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

  cellsTemplateArea(journal: Journal): string {
    const areas: string[][] = new Array(journal.rows.length).fill([])
      .map(() => new Array(journal.columns.length).fill(''));

    journal.columns.forEach((c, ci) => {
      journal.rows.forEach((r, ri) => {
        areas[ri][ci] = this.columnRowArea(r.id, c.id);
        this.cells.push([r.id, c.id]);
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
          display: grid;
          grid-template-rows: auto auto 1fr;
          grid-template-columns: 150px 1fr;
          gap: var(--indent2);
          margin: 0 var(--indent2);
      }

      .reports, journal-column-cell button, .add-mark {
        display: none;
      }

      journal-cell {
        display: flex;
        gap: 8px;
        height: 50px;
        width: fit-content;
        border-radius: var(--border-radius2);
      }

      journal-cell div {
        display: grid;
        place-items: center;
        height: 100%;
        border-radius: var(--border-radius1);
      }

      section.columns {
        grid-row: 2;
        grid-column: 2;
        display: flex;
        align-self: center;
        gap: 16px;
      }

      section.columns journal-column-cell {
        display: grid;
        place-items: center;
        font-variant-numeric: tabular-nums;
        width: 125px;
      }

      journal-cell {
        min-width: 125px;
        width: fit-content;
      }

      section.rows {
        grid-row: 3;
        grid-column: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      section.rows span {
        display: flex;
        align-items: center;
        height: 50px;
      }

      main {
        grid-row: 3;
        grid-column: 2;
        display: grid;
        grid-template-columns: min-content;
        grid-template-rows: min-content;
        grid-gap: 16px;
      }
    `;
    const html = document.getElementsByTagName('journal-view')[0].innerHTML;

    const htmlWithStyles = `
    <style>${styles}</style>
    ${html}
    `

    const win = window.open('', 'Report', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
    if (!win) return;

    win.document.body.innerHTML = htmlWithStyles;
  }

  private columnRowArea(columnId: string, rowId: string): string {
    return columnId.replaceAll(/[^a-zA-Z0-9]/g, '') + rowId.replaceAll(/[^a-zA-Z0-9]/g, '');
  }
}
