import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpContextWithStudyPlace } from '@likdan/studyum-core';
import { Observable } from 'rxjs';
import { Option } from '../models/options';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  private http = inject(HttpClient);

  getOptions(): Observable<Option[]> {
    return this.http.get<Option[]>('api/journal/v1/options', { context: httpContextWithStudyPlace() });
  }
}
