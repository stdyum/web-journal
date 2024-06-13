import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilderComponent, FormConfig } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslationPipe, TranslationService } from '@likdan/studyum-core';

@Component({
  selector: 'app-mark-dialog',
  standalone: true,
  imports: [
    FormBuilderComponent,
    MatButton,
    TranslationPipe,
  ],
  templateUrl: './mark-dialog.component.html',
  styleUrl: './mark-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkDialogComponent {
  initial = inject(MAT_DIALOG_DATA);

  private dialogRef = inject(MatDialogRef);
  private translation = inject(TranslationService);

  config = <FormConfig<any>>{
    controls: {
      mark: {
        type: Controls.textInput,
        label: this.translation.getTranslation('mark_form_mark'),
        validators: [Validators.required],
      },
    },
    initialValue: {
      mark: this.initial?.mark ?? '',
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: this.translation.getTranslation('mark_form_confirm'),
      onSubmit: e => {
        if (!e.valid) return;

        this.dialogRef.close({ type: 'add', value: e.value });
      },
    },
  };

  remove(): void {
    this.dialogRef.close({ type: 'remove' });
  }
}
