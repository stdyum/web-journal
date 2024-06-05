import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Option } from '../../models/options';

@Component({
  selector: 'journal-option',
  standalone: true,
  templateUrl: './journal-option.component.html',
  styleUrl: './journal-option.component.css',
  host: {
    class: 'accent-container',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalOptionComponent {
  option = input<Option | null>(null);
}
