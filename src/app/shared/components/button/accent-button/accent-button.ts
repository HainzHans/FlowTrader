import {Component, input, output, signal} from '@angular/core';

@Component({
  selector: 'app-accent-button',
  imports: [],
  templateUrl: './accent-button.html',
  styleUrl: './accent-button.css',
})
export class AccentButton {

  buttonText = input<string>('');
  buttonIcon = input<string>('');
  buttonClick = output<void>();
  isLarge = input.required<boolean>()

}
