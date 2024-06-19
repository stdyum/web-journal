import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilderComponent, FormConfig } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Validators } from '@angular/forms';
import { TranslationService } from '@likdan/studyum-core';

@Component({
  selector: 'app-report-config-dialog',
  standalone: true,
  imports: [
    FormBuilderComponent,
  ],
  templateUrl: './report-config-dialog.component.html',
  styleUrl: './report-config-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportConfigDialogComponent {
  private dialogRef = inject(MatDialogRef);
  private translation = inject(TranslationService);

  config = <FormConfig<any>>{
    controls: {
      type: {
        type: Controls.select,
        label: this.translation.getTranslation('report_config_form_type'),
        additionalFields: {
          searchable: false,
          items: computed(() => [
            {
              display: this.translation.getTranslation('report_config_form_type_marks')(),
              value: { classesToHide: '.absence', title: 'report_marks_header' },
            },
            {
              display: this.translation.getTranslation('report_config_form_type_absences')(),
              value: { classesToHide: '.mark', title: 'report_absences_header' },
            },
          ]),
        },
        validators: [Validators.required],
      },
      range: {
        type: Controls.dateRange,
        label: this.translation.getTranslation('report_config_form_range'),
      },
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: this.translation.getTranslation('report_config_form_confirm'),
      onSubmit: e => {
        if (!e.valid) return;

        this.dialogRef.close(e.value);
      },
    },
  };
}
