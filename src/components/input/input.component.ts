import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
    @Input() value: string = '';
    @Output() valueChange = new EventEmitter();

  handleChange(e: Event ) {
      if (e.target){
        this.valueChange.emit((e.target as HTMLInputElement).value);
      }
}
}
