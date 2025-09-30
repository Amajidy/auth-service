import {Component, signal} from '@angular/core';
import {InputComponent} from "../../../components/input/input.component";
import {ButtonComponent} from "../../../components/button/button.component";

@Component({
  selector: 'app-shahkar',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './shahkar.component.html',
  styleUrl: './shahkar.component.scss'
})
export class ShahkarComponent {
    nationalId = signal<string>('');
}
