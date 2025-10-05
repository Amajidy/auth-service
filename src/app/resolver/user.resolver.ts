import { ResolveFn } from '@angular/router';
import {computed, inject} from "@angular/core";
import {VerificationService} from "../services/verification.service";
import {UserQuery, UserQueryResponse} from "../entities/verification.entity";

export const userResolver: ResolveFn<UserQueryResponse | null> = async (route, state) => {
  const _verificationService = inject(VerificationService);
  const user: UserQuery = route.queryParams as UserQuery;
  const temp = _verificationService.getState();

  const valueToSend = user?.trackingCode ? user : temp;
  if (!valueToSend) return null; // اگه هیچ دیتایی نداشتیم


  const response = await _verificationService.startAction(valueToSend);
  _verificationService.saveState(response);

  return response;
};

