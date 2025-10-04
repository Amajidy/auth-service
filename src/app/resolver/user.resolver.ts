import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {VerificationService} from "../services/verification.service";
import {UserQuery, UserQueryResponse} from "../entities/verification.entity";

export const userResolver: ResolveFn<boolean> = (route, state) => {
  const _verificationService = inject(VerificationService);
  console.log(route);

  const test: UserQuery = {
    trackingCode: 'HwyNH1ljEphP5HjL2MMpDulUAvH6tr2dCHKGBDdAotE',
    firstName: 'تست',
    lastName: 'تستیات',
    nationalCode: "1234554321",
    mobileNumber: "09358247776"
  }
  // const startAction = _verificationService.startAction(test);
  // startAction.then(response => _verificationService.saveState(response));
  // return startAction;
  return true
};
