import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Injectable()
export class RegistrationService {

  private _SSN: string;

  constructor(private storage: LocalStorage) { }

  clear() {
    this._SSN = '';
    return this.storage.clear();
  }

  getStepDetail(key: string) {
    return this.storage.getItem(key);
  }

  setStepDetail(key: string, obj: any) {
    return this.storage.setItem(key, obj)
  }

  getSSN() {
    return this._SSN;
  }

  setSSN(SSN: string) {
    this._SSN = SSN;
  }
}
