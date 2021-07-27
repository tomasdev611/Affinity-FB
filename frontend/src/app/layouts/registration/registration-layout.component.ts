import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {LoadCommonInfo} from '../../states/actions/common.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './registration-layout.component.html',
  styleUrls: ['./registration-layout.component.scss']
})
export class RegistrationLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private store: Store<any>,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadCommonInfo());
    console.log(this.router.url);
  }

  triggerCancel(): void {
    console.log('remove user');
    this.router.navigate(['/registration/step1']);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
  }
}
