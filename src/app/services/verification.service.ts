import {inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {baseUrl} from "../environments/environment";
import {UserQuery, UserQueryResponse} from "../entities/verification.entity";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private _http = inject(HttpClient);
  private _router = inject(Router);

  userQueryResponse = signal<UserQueryResponse | null>(null);

  async startAction(user: UserQuery) {
    return await firstValueFrom(this._http.post<UserQueryResponse>(baseUrl + 'verification/start', user));
  };

  start(user: UserQuery) {
    this.startAction(user).then(response => {
      this.userQueryResponse.set(response);
    });
  };

  saveState(user: UserQueryResponse){
    localStorage.setItem("user", JSON.stringify(user));
  }

  get getState(): WritableSignal<UserQueryResponse | null>{
    return signal(JSON.parse(<string>localStorage.getItem('user')) as UserQueryResponse || null)
  }


  async shahkarAction(value: object) {
    return await firstValueFrom(this._http.post(baseUrl + 'verification/step/shahkar', value));
  }

  shahkar(value: object) {
    return this.shahkarAction(value).then((response:any) => {
      if(response.isPassed){
        this._router.navigate(['video'])
      }
    })
  }


}
