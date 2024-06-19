import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JournalViewService } from './journal-view.service';
import { filter, switchMap, take, tap } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Journal, JournalCell, JournalColumn, JournalRow } from '../../models/journal';
import { JournalCellComponent } from '../../components/journal-cell/journal-cell.component';
import { JournalColumnCellComponent } from '../../components/journal-column-cell/journal-column-cell.component';
import { MatButton } from '@angular/material/button';
import { TranslationPipe, TranslationService } from '@likdan/studyum-core';
import { MatDialog } from '@angular/material/dialog';
import { ReportConfigDialogComponent } from '../../dialogs/report-config-dialog/report-config-dialog.component';

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
  cells = signal<[string, string][]>([]);
  cellsTemplateAreas = signal<string>('');

  private service = inject(JournalViewService);
  private route = inject(ActivatedRoute);
  journal$ = this.route.queryParams
    .pipe(switchMap(p => this.service.getJournal(p)))
    .pipe(tap(j => this.cellsTemplateAreas.set(this.generateCellsTemplateAreas(j))))
    .pipe(tap(j => this.cells.set(this.generateCells(j))));
  private dialog = inject(MatDialog);
  private translation = inject(TranslationService);

  generateCellsTemplateAreas(journal: Journal): string {
    const areas: string[][] = new Array(journal.rows.length).fill([])
      .map(() => new Array(journal.columns.length).fill(''));

    journal.columns.forEach((c, ci) => {
      journal.rows.forEach((r, ri) => {
        areas[ri][ci] = this.columnRowArea(r.id, c.id);
      });
    });

    const columnsArea = `"fill ${journal.columns.map(c => `col${c.id.replaceAll(/[^a-zA-Z0-9]/g, '')}`).join(' ')}"`;
    const rowsArea = journal.rows.map(c => `row${c.id.replaceAll(/[^a-zA-Z0-9]/g, '')}`);
    return columnsArea + '\n' + areas.map((a, i) => `"${rowsArea[i]} ${a.join(' ')}"`).join('\n');
  }

  generateCells(journal: Journal): [string, string][] {
    const cells: [string, string][] = [];

    journal.columns.forEach(c => {
      journal.rows.forEach(r => {
        cells.push([r.id, c.id]);
      });
    });

    return cells;
  }

  columnArea(column: JournalColumn): string {
    return `col${column.id.replaceAll(/[^a-zA-Z0-9]/g, '')}`;
  }

  rowArea(row: JournalRow): string {
    return `row${row.id.replaceAll(/[^a-zA-Z0-9]/g, '')}`;
  }

  cellArea(cell: JournalCell): string {
    return this.columnRowArea(cell.point.rowId, cell.point.columnId);
  }

  canEdit(journal: Journal): boolean {
    return journal.info.type === 'group';
  }

  getCell(journal: Journal, cell: [string, string]): JournalCell {
    let cellIndex = journal.cells.findIndex(c => c.point.rowId === cell[0] && c.point.columnId === cell[1]);
    if (cellIndex === -1) {
      journal.cells.push({
        point: {
          rowId: cell[0],
          columnId: cell[1],
        },
        marks: [],
        absences: [],
      });
      cellIndex = journal.cells.length - 1;
    }

    return journal.cells[cellIndex];
  }

  emptyCell(cell: [string, string]): string {
    return this.columnRowArea(cell[0], cell[1]);
  }

  showReportConfigDialog(): void {
    this.dialog.open(ReportConfigDialogComponent)
      .afterClosed()
      .pipe(take(1))
      .pipe(filter(v => !!v))
      .pipe(tap(console.log))
      .subscribe(v => this.generateReport(v.type.title, v.type.classesToHide, v.range.start, v.range.end));
  }

  private generateReport(title: string, invisibleSelector: string, from: Date, to: Date): void {
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

      .reports, journal-column-cell button, .add-mark, ${invisibleSelector} {
        display: none !important;
      }

      .fill {
        width: auto;
      }

      main > * {
        width: 100%;
        border: 1px solid black;
        overflow: hidden;
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
        background: white !important;
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
        width: 100%;
        height: 100%;
        padding: 0 8px;
        box-sizing: border-box;
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
    <h1>${this.translation.getTranslation(title)()}</h1>
    ${html}`;

    const win = window.open('', '_blank', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
    if (!win) return;

    win.document.body.innerHTML = htmlWithStyles;

    function isDateInRange(dateString: any, startDate: any, endDate: any) {
      const date = new Date(dateString);
      return date >= startDate && date <= endDate;
    }

    function hideColumns(area: string): void {
      win!.document.querySelectorAll('main > journal-cell').forEach(el => {
        if ((el as HTMLElement).style.gridArea.includes(area)) {
          (el as HTMLElement).style.display = 'none';
        }
      });
    }

    function hideElementsByDate(selector: any) {
      const elements = win!.document.querySelectorAll(selector);

      const templateColumns: string[] = ['auto'];

      elements.forEach(element => {
        const dateText = element.innerText.trim();
        if (isDateInRange(dateText, from, to)) {
          templateColumns.push('auto');
        } else {
          templateColumns.push('0');
          (element as HTMLElement).parentElement!.style.display = 'none';
          const area = (element as HTMLElement).parentElement!.style.gridArea.substring(3);
          hideColumns(area);
        }
      });

      win!.document.querySelector('main')!.style.gridTemplateColumns = templateColumns.join(' ');
    }

    hideElementsByDate('journal-column-cell > span');
  }

  private columnRowArea(columnId: string, rowId: string): string {
    return 'area' + columnId.replaceAll(/[^a-zA-Z0-9]/g, '') + rowId.replaceAll(/[^a-zA-Z0-9]/g, '');
  }
}
