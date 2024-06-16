import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JournalOptionsService } from './journal-options.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { JournalOptionComponent } from '../../components/journal-option/journal-option.component';
import { Params, Router, RouterLink } from '@angular/router';
import { Option } from '../../models/options';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { FormBuilderComponent, FormConfig } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { TranslationPipe, TranslationService } from '@likdan/studyum-core';

@Component({
  selector: 'journal-options',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    JournalOptionComponent,
    RouterLink,
    ReactiveFormsModule,
    MatButton,
    FormBuilderComponent,
    TranslationPipe,
  ],
  templateUrl: './journal-options.component.html',
  styleUrl: './journal-options.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalOptionsComponent {
  private router = inject(Router);
  private service = inject(JournalOptionsService);
  private translation = inject(TranslationService);

  searchFormConfig = <FormConfig<any>>{
    controls: {
      groupId: {
        type: Controls.select,
        label: this.translation.getTranslation('options_search_form_group'),
        additionalFields: {
          searchable: true,
          searchInputText: this.translation.getTranslation('controls_select_search'),
          loadNextButtonText: this.translation.getTranslation('controls_select_load_next'),
          ...this.service.getGroups(),
        },
        validators: [Validators.required],
      },
      subjectId: {
        type: Controls.select,
        label: this.translation.getTranslation('options_search_form_subject'),
        additionalFields: {
          searchable: true,
          searchInputText: this.translation.getTranslation('controls_select_search'),
          loadNextButtonText: this.translation.getTranslation('controls_select_load_next'),
          ...this.service.getSubjects(),
        },
        validators: [Validators.required],
      },
      teacherId: {
        type: Controls.select,
        label: this.translation.getTranslation('options_search_form_teacher'),
        additionalFields: {
          searchable: true,
          searchInputText: this.translation.getTranslation('controls_select_search'),
          loadNextButtonText: this.translation.getTranslation('controls_select_load_next'),
          ...this.service.getTeachers(),
        },
        validators: [Validators.required],
      },
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: this.translation.getTranslation('options_search_form_go'),
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
