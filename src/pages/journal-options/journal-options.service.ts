import { inject, Injectable, Signal } from '@angular/core';
import { OptionsService } from '../../services/options.service';
import { Options } from '../../models/options';
import { Group, RegistryService, Subject, Teacher } from '@likdan/studyum-core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JournalOptionsService {
  private optionsService = inject(OptionsService);
  private registry = inject(RegistryService);

  loadOptions(): Signal<Options | null> {
    return this.optionsService.loadOptions();
  }

  nextOptions(): Signal<Options | null> {
    return this.optionsService.nextOptions();
  }

  getSubjects(): Observable<Subject[]> {
    return this.registry.getSubjectsPaginatedForSelect()
      .pipe(map(p => p?.items ?? []));
  }

  getGroups(): Observable<Group[]> {
    return this.registry.getGroupsPaginatedForSelect()
      .pipe(map(p => p?.items ?? []));
  }

  getTeachers(): Observable<Teacher[]> {
    return this.registry.getTeachersPaginatedForSelect()
      .pipe(map(p => p?.items ?? []));
  }
}
