
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";

// import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';

@Injectable()
export class UtilsService {
  /**
   *
   * @param http
   * @param router
   */
  constructor(private http: HttpClient, private router: Router) { }

  makeFileRequest(img_text, url: string, params: Array<string>, files: File) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      formData.append("", files, img_text);
      for (var key of formData.entries()) { console.log(key[0] + ', ' + key[1]); }

      this.http.post(url, formData).subscribe((data) => {
        resolve("");
      }, (err) => {
        reject("");
      })
    });
  }

}
