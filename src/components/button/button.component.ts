import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() type: string = 'button';
  @Input() btnType: 'primary' | 'secondary' = 'primary';
  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
}
