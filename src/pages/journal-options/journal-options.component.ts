import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JournalOptionsService } from './journal-options.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { JournalOptionComponent } from '../../components/journal-option/journal-option.component';
import { Params, Router, RouterLink } from '@angular/router';
import { Option } from '../../models/options';
import { TextInputComponent } from '@likdan/form-builder-material/src/components';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { FormBuilderComponent, FormConfig } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';

@Component({
  selector: 'journal-options',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    JournalOptionComponent,
    RouterLink,
    TextInputComponent,
    ReactiveFormsModule,
    MatButton,
    FormBuilderComponent,
  ],
  templateUrl: './journal-options.component.html',
  styleUrl: './journal-options.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalOptionsComponent {
  private router = inject(Router);
  private service = inject(JournalOptionsService);

  searchFormConfig = <FormConfig<any>>{
    controls: {
      groupId: {
        type: Controls.select,
        label: 'Group',
        additionalFields: {
          searchable: false,
          items: this.service.getGroups(),
        },
        validators: [Validators.required],
      },
      subjectId: {
        type: Controls.select,
        label: 'Subject',
        additionalFields: {
          searchable: false,
          items: this.service.getSubjects(),
        },
        validators: [Validators.required],
      },
      teacherId: {
        type: Controls.select,
        label: 'Teacher',
        additionalFields: {
          searchable: false,
          items: this.service.getTeachers(),
        },
        validators: [Validators.required],
      },
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: 'Go',
      onSubmit: e => {
        if (!e.valid) return;

        this.router.navigate(['view'], {
          queryParams: {
            type: 'group',
            ...e.value,
          },
        }).then();
      },
    },
  };

  options = this.service.loadOptions();

  buildQueryParamsForOption(option: Option): Params {
    return {
      type: option.type,
      groupId: option.group.id,
      subjectId: option.subject.id,
      teacherId: option.teacher.id,
    };
  }

  loadNextOptions(): void {
    this.service.nextOptions();
  }
}
