import {inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {baseUrl} from "../environments/environment";
import {UserQuery, UserQueryResponse} from "../entities/verification.entity";

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private _http = inject(HttpClient);

  userQueryResponse = signal<UserQueryResponse | null>(null);

  async startAction(user: UserQuery) {
    return await firstValueFrom(this._http.post<UserQueryResponse>(baseUrl + 'verification/start', user, {
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'HwyNH1ljEphP5HjL2MMpDulUAvH6tr2dCHKGBDdAotE' }
    }));
  };

  start(user: UserQuery) {
    this.startAction(user).then(response => {
      this.userQueryResponse.set(response);
    });
  };

  saveState(user: UserQueryResponse){
    localStorage.setItem("user", JSON.stringify(user));
  }

  getState(): WritableSignal<UserQueryResponse | null>{
    return signal(JSON.parse(<string>localStorage.getItem('user')) as UserQueryResponse || null)
  }


}
