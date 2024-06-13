import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Option } from '../../models/options';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'journal-option',
  standalone: true,
  templateUrl: './journal-option.component.html',
  styleUrl: './journal-option.component.css',
  host: {
    class: 'accent-container',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
  ],
})
export class JournalOptionComponent {
  option = input<Option | null>(null);
}
