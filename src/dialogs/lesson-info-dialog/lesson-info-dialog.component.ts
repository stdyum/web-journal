import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilderComponent, FormConfig } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Validators } from '@angular/forms';
import { TranslationService } from '@likdan/studyum-core';

@Component({
  selector: 'app-lesson-info-dialog',
  standalone: true,
  imports: [
    FormBuilderComponent,
  ],
  templateUrl: './lesson-info-dialog.component.html',
  styleUrl: './lesson-info-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonInfoDialogComponent {
  private dialogRef = inject(MatDialogRef);

  private data = inject(MAT_DIALOG_DATA);
  private initial = this.data?.initial;
  private translation = inject(TranslationService);

  config = <FormConfig<any>>{
    controls: {
      title: {
        type: Controls.textInput,
        label: this.translation.getTranslation('lesson_info_form_title'),
        validators: [Validators.required],
      },
      description: {
        type: Controls.textInput,
        label: this.translation.getTranslation('lesson_info_form_description'),
        validators: [Validators.required],
      },
      homework: {
        type: Controls.textInput,
        label: this.translation.getTranslation('lesson_info_form_homework'),
        validators: [Validators.required],
      },
      type: {
        type: Controls.textInput,
        label: this.translation.getTranslation('lesson_info_form_type'),
        validators: [Validators.required],
      },
    },
    initialValue: {
      title: this.initial?.title ?? '',
      description: this.initial?.description ?? '',
      homework: this.initial?.homework ?? '',
      type: this.initial?.type ?? '',
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: this.translation.getTranslation('lesson_info_form_confirm'),
      onSubmit: e => {
        if (!e.valid) return;

        this.dialogRef.close(e.value);
      },
    },
  };
}
