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

  getSubjects(): Object {
    return this.registry.getSubjectsPaginatedSelectConfig()
  }

  getGroups(): Object {
    return this.registry.getGroupsPaginatedSelectConfig()
  }

  getTeachers(): Object {
    return this.registry.getTeachersPaginatedSelectConfig()
  }
}
