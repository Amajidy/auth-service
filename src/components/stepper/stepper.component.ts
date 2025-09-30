import {Component, input, Input} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {
  @Input() steps: string[] = [];
  step = input<number>(1);
}
