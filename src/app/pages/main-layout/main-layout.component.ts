import {Component, computed, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {StepperComponent} from "../../../components/stepper/stepper.component";
import {toSignal} from "@angular/core/rxjs-interop";
import {Step, UserQueryResponse} from "../../entities/verification.entity";

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
export class MainLayoutComponent implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private data = toSignal(this._activatedRoute.data);

  user = computed(() => this.data()?.['user'] as UserQueryResponse);
  step = computed(() => {
    switch (this.user().currentStep) {
      case Step.SHAHKAR:
        return 1;
        case Step.VIDEO:
          return 2;
          case Step.SIGN:
            return 3;
      default:
        return 0;
    }
  })
  ngOnInit() {
    if (!this.user().isCompleted) {
      if (this.user().currentStep === Step.SHAHKAR) {
        this._router.navigate(['shahkar']);
      } else if (this.user().currentStep === Step.VIDEO) {
        this._router.navigate(['video']);
      } else {
        this._router.navigate(['sign']);
      }
    } else {
      console.log('your authorization has been completed.');
    }
  }
}
