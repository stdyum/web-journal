import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpContextWithStudyPlace } from '@likdan/studyum-core';
import { Options } from '../models/options';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  options = signal<Options | null>(null);

  private http = inject(HttpClient);

  loadOptions(): Signal<Options | null> {
    this.http.get<Options>('api/journal/v1/options', { context: httpContextWithStudyPlace() })
      .pipe(take(1))
      .subscribe(o => {
        o.hasNext = o.options.length !== 0;
        this.options.set(o);
      });

    return this.options;
  }

  nextOptions(): Signal<Options | null> {
    this.http.get<Options>('api/journal/v1/options', {
      params: {
        cursor: this.options()?.next ?? '',
        limit: this.options()?.limit ?? '',
      },
      context: httpContextWithStudyPlace(),
    })
      .pipe(take(1))
      .subscribe(o => {
        o.hasNext = o.options.length !== 0;
        o.options = [...(this.options()?.options ?? []), ...o.options];
        this.options.set(o);
      });

    return this.options;
  }
}
