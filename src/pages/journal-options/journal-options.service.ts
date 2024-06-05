import { inject, Injectable } from '@angular/core';
import { OptionsService } from '../../services/options.service';
import { Option } from '../../models/options';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JournalOptionsService {
  private optionsService = inject(OptionsService);

  get options(): Observable<Option[]> {
    return this.optionsService.getOptions();
  }
}
