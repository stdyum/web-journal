export interface Journal {
  rows: JournalRow[];
  columns: JournalColumn[];
  cells: JournalCell[];
  info: JournalInfo;
}

export interface JournalRow {
  id: string;
  title: string;
}

export interface JournalColumn {
  id: string;
  title: string;
}

export interface JournalCell {
  point: JournalCellPoint;
  marks: JournalMark[];
}

export interface JournalCellPoint {
  rowId: string;
  columnId: string;
}

export interface JournalMark {
  id: string;
  mark: string;
  lessonId: string;
  studentId: string;
}

export interface JournalInfo {
  type: string;
}
