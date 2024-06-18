import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilderComponent, FormConfig } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslationPipe, TranslationService } from '@likdan/studyum-core';

@Component({
  selector: 'app-absence-dialog',
  standalone: true,
  imports: [
    FormBuilderComponent,
    MatButton,
    TranslationPipe,
  ],
  templateUrl: './absence-dialog.component.html',
  styleUrl: './absence-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbsenceDialogComponent {
  initial = inject(MAT_DIALOG_DATA);

  private dialogRef = inject(MatDialogRef);
  private translation = inject(TranslationService);

  config = <FormConfig<any>>{
    controls: {
      absence: {
        type: Controls.numberInput,
        label: this.translation.getTranslation('absence_form_absence'),
      },
    },
    initialValue: {
      absence: this.initial?.absence ?? null,
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: this.translation.getTranslation('absence_form_confirm'),
      onSubmit: e => {
        if (!e.valid) return;

        this.dialogRef.close({ type: 'add', value: e.value });
      },
    },
  };

  remove(): void {
    this.dialogRef.close({ type: 'remove' });
  }

  add(): void {
    this.dialogRef.close({ type: 'add', value: {} });
  }
}
