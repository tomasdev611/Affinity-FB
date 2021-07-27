import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {UserService} from '../../services/db/user.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  NewPassword: any;
  ConfirmNewPassword: any;
  username: any;
  saved: boolean;
  saved_error: boolean;
  constructor(private userService: UserService) {}

  ngOnInit() {}

  resetUserPassword() {
    //  Call api for reset password
    let postData = {
      userPassword: this.NewPassword
    };
    this.username = localStorage.getItem('username');

    if (this.NewPassword != this.ConfirmNewPassword) {
      this.saved_error = true;
      this.saved = false;
    } else {
      this.userService.resetUserPassword(this.username, this.NewPassword);
    }
  }
}
