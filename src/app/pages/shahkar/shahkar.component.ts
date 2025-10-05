import {Component, inject, OnInit, signal} from '@angular/core';
import {InputComponent} from "../../../components/input/input.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {VerificationService} from "../../services/verification.service";

@Component({
  selector: 'app-shahkar',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './shahkar.component.html',
  styleUrl: './shahkar.component.scss'
})
export class ShahkarComponent implements OnInit {
    private _verificationService = inject(VerificationService);
    shahkar = new FormGroup({
        nationalCode: new FormControl(this._verificationService.getState()?.nationalCode ?? ''),
      mobileNumber: new FormControl(this._verificationService.getState()?.mobileNumber ?? ''),
    });

    ngOnInit(): void {

    }


    submit(){
      const shahkarTemp = {
        ...this.shahkar.value,
        trackingCode: this._verificationService.getState()?.trackingCode,
      }
      this._verificationService.shahkar(shahkarTemp)
    }

}
