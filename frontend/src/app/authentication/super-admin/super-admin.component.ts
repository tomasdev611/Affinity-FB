import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl,AbstractControl,ValidatorFn } from '@angular/forms';
import { UserService } from '../../services/db/user.service';
import { AuthService } from '../../services/gaurd/auth.service';
import { SettingsService } from '../../services/settings/settings.service';
import { AppComponent } from '../../app.component';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss'],
  providers: [SettingsService]
})

export class SuperAdminComponent implements OnInit {
  invalidlogin = ""
  public form: FormGroup;
  attInvalidUserName = true;
  // for check user is super admin or any
  checkUserName: string;
  constructor(private authService: AuthService, private userService: UserService, private fb: FormBuilder, private router: Router, private settingsService: SettingsService, private appComponent: AppComponent) { }

  ngOnInit() {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });

  }

  forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const forbidden = nameRe.test(control.value);
      return forbidden ?null: {'forbiddenName': {value: control.value}};
    };
  }

  onSubmit() {
    this.checkUserName= this.form.controls.uname.value;
    const body = { 'username': this.form.controls.uname.value, 'password': this.form.controls.password.value };
    this.checkUserName= this.form.controls.uname.value;
    this.authService.loginSuperAdmin(body).subscribe((data) => {
    if (data.status) {

        localStorage.setItem('auth_token', data.auth_token);
        localStorage.setItem('username', data[0].user_name);

        this.router.navigate(['/admin/supdivision']);
        //call the function to get the timeout data
      }
      else {
        this.invalidlogin = "Invalid Login!"
      }
    },(error)=>{

      this.attInvalidUserName = false;
      setTimeout(() => this.attInvalidUserName = true, 5000);

      console.log(error);

    });

  }

  quit() {
    localStorage.clear();
    this.router.navigate(['authentication/signin']);
  }


}

