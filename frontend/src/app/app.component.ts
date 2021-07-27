import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Keepalive} from '@ng-idle/keepalive';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {select, Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {AuthService} from './services/gaurd/auth.service';
import {Location} from '@angular/common';
import {LoadCurrentUserInfo} from './states/actions/auth.actions';
import * as fromRoot from './states/reducers';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  //for the automatic logout
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  user: any = null;

  constructor(
    translate: TranslateService,
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private authService: AuthService,
    private location: Location,
    private store: Store<any>
  ) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

    if (this.authService.isLoggedIn) {
      this.store.dispatch(new LoadCurrentUserInfo());
    }
  }

  ngOnInit() {
    this.store.pipe(select(fromRoot.getAuthUser)).subscribe(data => {
      if (!this.user && data) {
        let timeout = localStorage.getItem('inactivityTimeout');
        this.monitoUserActivity(parseInt(timeout, 10));
        // console.log('REDIRECTING', data);
        // this.router.navigate(['/']);
      }
      this.user = data;
    });
  }

  monitoUserActivity(timeduration) {
    //alert("Time is" + timeduration);
    //logic to logout the user
    // sets an idle timeout of 5 seconds, for testing purposes.
    this.idle.setIdle(timeduration * 60);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    // this.idle.setTimeout(timeduration * 60);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => (this.idleState = 'No longer idle.'));
    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;

      //alert("Time Out");
      //logut the user if auth token is found
      if (localStorage.getItem('auth_token') != undefined) {
        this.router.navigate(['authentication/signout']);
      }
    });
    this.idle.onIdleStart.subscribe(() => {
      //alert("User Idle");
      this.idleState = "You've gone idle!";
    });
    this.idle.onTimeoutWarning.subscribe(
      countdown => (this.idleState = 'You will time out in ' + countdown + ' seconds!')
    );

    // sets the ping interval to 15 seconds
    this.keepalive.interval(10);

    this.keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.reset();
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  //set left link function
  leftLink() {
    // this.authService.clientLink(this.location.path());
    // var _linkInfo = JSON.parse(localStorage.getItem('LinkInfo'));
    // if (this.search(_linkInfo[0].linkName, this.authService.leftLinks) === -1) {
    //   this.authService.leftLinks.push({
    //     link: _linkInfo[0].link,
    //     linkName: _linkInfo[0].linkName,
    //     client_name: false
    //   });
    // }
  }

  search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].linkName === nameKey) {
        return i;
      }
    }
    return -1;
  }
}
