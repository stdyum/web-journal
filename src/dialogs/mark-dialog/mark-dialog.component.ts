import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilderComponent, FormConfig } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-mark-dialog',
  standalone: true,
  imports: [
    FormBuilderComponent,
    MatButton,
  ],
  templateUrl: './mark-dialog.component.html',
  styleUrl: './mark-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkDialogComponent {
  initial = inject(MAT_DIALOG_DATA);

  private dialogRef = inject(MatDialogRef);

  config = <FormConfig<any>>{
    controls: {
      mark: {
        type: Controls.textInput,
        label: 'Mark',
        validators: [Validators.required],
      },
    },
    initialValue: {
      mark: this.initial?.mark ?? '',
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: 'Confirm',
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
