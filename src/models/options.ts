export interface Options {
  options: Option[];
  next: string;
  limit: 10;
  hasNext: boolean;
}

export interface Option {
  type: string;
  subject: OptionSubject;
  group: OptionGroup;
  teacher: OptionTeacher;
}

export interface OptionSubject {
  id: string,
  name: string
}

export interface OptionGroup {
  id: string,
  name: string
}

export interface OptionTeacher {
  id: string,
  name: string
}