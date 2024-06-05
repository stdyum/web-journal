import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JournalOptionsService } from './journal-options.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { JournalOptionComponent } from '../../components/journal-option/journal-option.component';
import { Params, RouterLink } from '@angular/router';
import { Option } from '../../models/options';

@Component({
  selector: 'journal-options',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    JournalOptionComponent,
    RouterLink,
  ],
  templateUrl: './journal-options.component.html',
  styleUrl: './journal-options.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalOptionsComponent {
  private service = inject(JournalOptionsService);

  options$ = this.service.options;

  buildQueryParamsForOption(option: Option): Params {
    return {
      type: option.type,
      groupId: option.group.id,
      subjectId: option.subject.id,
      teacherId: option.teacher.id,
    };
  }
}
