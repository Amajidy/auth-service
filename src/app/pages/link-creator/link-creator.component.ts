import {Component, inject, signal} from '@angular/core';
import {InputComponent} from "../../../components/input/input.component";
import {Router, RouterLink} from "@angular/router";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {ButtonComponent} from "../../../components/button/button.component";

@Component({
  selector: 'app-link-creator',
  standalone: true,
  imports: [
    InputComponent,
    RouterLink,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './link-creator.component.html',
  styleUrl: './link-creator.component.scss'
})
export class LinkCreatorComponent {
  private _router = inject(Router);
  apiKey = new FormControl('')

  navigate() {
    if (this.apiKey.value) {
      localStorage.setItem('api-key', this.apiKey.value);
    }
    // this._router.navigate(['', '/?trackingCode=' + this.randomString() + '&firstName=' + this.randomFirstName() + '&lastName=' + this.randomLastNameFa() + '&nationalCode=' + this.randomNationalId() + '&mobileNumber=' + this.randomPhoneNumber()])
    this._router.navigate(['shahkar'], {
      queryParams: {
        trackingCode: this.randomString(),
        firstName: this.randomFirstName(),
        lastName: this.randomLastNameFa(),
        nationalCode: this.randomNationalId(),
        mobileNumber: this.randomPhoneNumber(),
      }
    })
  }

  randomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  randomPhoneNumber() {
    const prefixes = [
      '0901', '0902', '0903', '0905',
      '0910', '0911', '0912', '0913', '0914', '0915', '0916', '0917', '0918', '0919',
      '0920', '0921', '0922',
      '0930', '0933', '0935', '0936', '0937', '0938', '0939'
    ];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    let number = prefix;
    for (let i = 0; i < 7; i++) {
      number += Math.floor(Math.random() * 10);
    }

    return number;
  }

  randomNationalId() {
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  randomFirstName() {
    const firstNames = [
      'امیر', 'سارا', 'رضا', 'نیلوفر', 'علی', 'هانا', 'محمد',
      'مینا', 'حسین', 'فاطمه', 'مهدی', 'پریسا', 'سینا', 'لیلا',
      'زهرا', 'آراد', 'النا', 'کیان', 'نرگس', 'پارسا'
    ];
    return firstNames[Math.floor(Math.random() * firstNames.length)];
  }

  randomLastNameFa() {
    const lastNames = [
      'مجیدی', 'کریمی', 'حسینی', 'احمدی', 'رحمانی', 'ابراهیمی',
      'مرادی', 'محمدی', 'رضایی', 'عباسی', 'فرهادی', 'شریفی',
      'نادری', 'موسوی', 'قاسمی', 'نوری', 'پاکزاد', 'اصغری'
    ];
    return lastNames[Math.floor(Math.random() * lastNames.length)];
  }
}
