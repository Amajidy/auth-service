import { ResolveFn } from '@angular/router';
import {computed, inject} from "@angular/core";
import {VerificationService} from "../services/verification.service";
import {UserQuery, UserQueryResponse} from "../entities/verification.entity";

export const userResolver: ResolveFn<UserQueryResponse | null> = (route, state) => {
  const _verificationService = inject(VerificationService);
  const user: UserQuery = route.queryParams as UserQuery;
  let temp = _verificationService.getState();
  if (user?.trackingCode) {
    request(user as UserQueryResponse);
  } else {
    request(temp as UserQueryResponse);
  }
  async function request(value: UserQueryResponse) {
      const response = await _verificationService.startAction(value)
      _verificationService.saveState(response);
  }
  return _verificationService.getState()!
};
