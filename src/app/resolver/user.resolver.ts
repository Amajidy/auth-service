import { ResolveFn } from '@angular/router';
import {computed, inject} from "@angular/core";
import {VerificationService} from "../services/verification.service";
import {UserQuery, UserQueryResponse} from "../entities/verification.entity";

export const userResolver: ResolveFn<UserQueryResponse | null> = (route, state) => {
  const _verificationService = inject(VerificationService);
  const user: UserQuery = route.queryParams as UserQuery
  let temp = _verificationService.getState();
  async function request() {
    console.log(user)
    // if (user) {
      const response = await _verificationService.startAction(user.trackingCode ? user : temp as UserQuery)
      console.log(response)
      _verificationService.saveState(response);
      console.log(_verificationService.getState());
      temp = response;
    // }
  }
  request();
  return temp
};
