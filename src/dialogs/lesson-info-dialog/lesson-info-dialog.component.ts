import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilderComponent, FormConfig } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Validators } from '@angular/forms';

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

  config = <FormConfig<any>>{
    controls: {
      title: {
        type: Controls.textInput,
        label: 'Title',
        validators: [Validators.required],
      },
      description: {
        type: Controls.textInput,
        label: 'Description',
        validators: [Validators.required],
      },
      homework: {
        type: Controls.textInput,
        label: 'Homework',
        validators: [Validators.required],
      },
      type: {
        type: Controls.textInput,
        label: 'Type',
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
      buttonText: 'Confirm',
      onSubmit: e => {
        if (!e.valid) return;

        this.dialogRef.close(e.value);
      },
    },
  };
}
