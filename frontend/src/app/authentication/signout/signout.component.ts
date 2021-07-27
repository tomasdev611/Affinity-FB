import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Logout} from '../../states/actions/auth.actions';
import {AuthService} from '../../services/gaurd/auth.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent implements OnInit {
  constructor(private router: Router, private store: Store<any>, private authService: AuthService) {
    console.log('logging out ...');
    //localStorage.clear();
    this.router.navigate(['authentication/signin']);
    this.authService.logout();
    this.store.dispatch(new Logout());
    // this.allStorage();
  }

  // // for clear items from local storage
  // allStorage() {
  //   var keys = Object.keys(localStorage);
  //   keys.forEach(key => {
  //     if (!preserveKeys.includes(key)) {
  //       localStorage.removeItem(key);
  //     }
  //   });
  // }

  ngOnInit() {}
}
