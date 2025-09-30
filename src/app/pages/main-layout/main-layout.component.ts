import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {StepperComponent} from "../../../components/stepper/stepper.component";

@Component({
  selector: 'app-main-layout',
  standalone: true,
    imports: [
        RouterOutlet,
        StepperComponent
    ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
