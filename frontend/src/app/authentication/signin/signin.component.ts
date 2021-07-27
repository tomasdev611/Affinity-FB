import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import {UserService} from '../../services/db/user.service';
import {AuthService} from '../../services/gaurd/auth.service';
import {SettingsService} from '../../services/settings/settings.service';
import {AppComponent} from '../../app.component';
import {Subject} from 'rxjs';
import {Login} from '../../states/actions/auth.actions';
import * as fromRoot from '../../states/reducers';
import {CAREGIVER_REGISTRATION} from '../../config';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  providers: [SettingsService]
})
export class SigninComponent implements OnInit {
  public form: FormGroup;
  loading: boolean = false;
  user: any = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private appComponent: AppComponent,
    private store: Store<any>
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      division_id: [
        null,
        Validators.compose([Validators.required, this.forbiddenNameValidator(/^[a-z0-9]{10}$/)])
      ],
      uname: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });

    this.store.pipe(select(fromRoot.getAuthLoading)).subscribe(data => {
      this.loading = data;
    });

    this.store.pipe(select(fromRoot.getAuthUser)).subscribe(data => {
      if (!this.user && data) {
        const acl_allow = this.authService.checkOverallAccess(CAREGIVER_REGISTRATION);
        if (acl_allow.read) {
          this.router.navigate(['/registration/step1']);
        } else {
          this.router.navigate(['/']);
        }
      }
      this.user = data;
    });
  }

  forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? null : {forbiddenName: {value: control.value}};
    };
  }

  onSubmit() {
    const body = {
      division_id: this.form.controls.division_id.value,
      username: this.form.controls.uname.value,
      password: this.form.controls.password.value
    };
    this.store.dispatch(new Login(body));
  }
}
