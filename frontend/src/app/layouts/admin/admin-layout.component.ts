import {filter} from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
  NgZone,
  AfterViewInit
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as fromRoot from '../../states/reducers';

import {MenuItems} from '../../shared/menu-items/menu-items';
import {Subscription} from 'rxjs';

import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../services/gaurd/auth.service';
import {LoadCommonInfo} from '../../states/actions/common.actions';
import {LoadUnreadsCount} from '../../states/actions/message.actions';
// import { DetailsComponent } from '../../client/details/details.component';

const SMALL_WIDTH_BREAKPOINT = 991;

const DASHBOARD_LINKS = [
  {
    title: 'Dashboard',
    link: '/',
    icon: 'assets/images/icons/dashboard.svg'
  },
  {
    link: '/client/list',
    title: 'Clients',
    icon: 'assets/images/icons/client.png'
  },
  {
    link: '/caregiver/list',
    title: 'Caregivers',
    icon: 'assets/images/icons/doctor.svg',
    canClose: true
  },
  {
    link: '/caregiver/search',
    title: 'Caregiver Search',
    icon: 'assets/images/icons/doctor.svg',
    canClose: true
  },
  {
    link: '/schedule/calendar',
    title: 'Schedule',
    icon: 'assets/images/icons/calendar.svg',
    canClose: true
  },
  {
    link: '/reports/compliance/client',
    title: 'Client Compliance',
    icon: 'assets/images/icons/client.png'
  },
  {
    link: '/reports/compliance/caregiver',
    title: 'Caregiver Compliance',
    icon: 'assets/images/icons/doctor.svg'
  },
  // {
  //   link: '/reports/compliance/client',
  //   title: 'Notes Reports',
  //   icon: 'assets/images/icons/callcenter.png'
  // },
  // {
  //   link: '/reports/compliance/client',
  //   title: 'Client contacts',
  //   icon: 'assets/images/icons/callcenter.png'
  // },
  {
    link: '/admin/master-list',
    title: 'Admin',
    icon: 'assets/images/icons/admin.svg'
  },
  {
    link: '/chatrooms/list',
    title: 'Chatrooms',
    icon: 'assets/images/icons/speech-bubble.svg'
  }
];

export interface Options {
  heading?: string;
  removeFooter?: boolean;
  mapHeader?: boolean;
}

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  private _router: Subscription;
  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  currentLang = 'en';
  options: Options;
  theme = 'light';
  showSettings = false;
  isDocked = false;
  isBoxed = false;
  isOpened = true;
  mode = 'push';
  _mode = this.mode;
  _autoCollapseWidth = 991;
  width = window.innerWidth;
  leftLinks = [];
  totalUnreadCount = 0;
  loadUnreadCountInterval = null;

  dashboardLinks = DASHBOARD_LINKS;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  @ViewChild('sidebar') sidebar;

  constructor(
    public menuItems: MenuItems,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private modalService: NgbModal,
    private titleService: Title,
    private zone: NgZone,
    private authService: AuthService,
    private store: Store<any> // private detailsComponent: DetailsComponent
  ) {
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    // this.mediaMatcher.addListener(mql => zone.run(() => this.mediaMatcher = mql));
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadCommonInfo());
    if (this.isOver()) {
      this._mode = 'over';
      this.isOpened = false;
    }

    this._router = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Scroll to top on view load
        document.querySelector('.main-content').scrollTop = 0;
        this.runOnRouteChange();
      });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getUnreadsInfo)
      )
      .subscribe(data => {
        this.totalUnreadCount = data.totalUnreadCount;
      });
    this.leftLinks = this.authService.leftLinks;
    this.fetchUnreadsInfo();
    this.loadUnreadCountInterval = setInterval(() => {
      this.fetchUnreadsInfo();
    }, 20000);
  }

  ngAfterViewInit(): void {
    setTimeout(_ => this.runOnRouteChange());
    //console.log(this.authService.leftLinks);
  }

  fetchUnreadsInfo() {
    this.store.dispatch(new LoadUnreadsCount({}));
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    if (this.loadUnreadCountInterval) {
      clearInterval(this.loadUnreadCountInterval);
      this.loadUnreadCountInterval = null;
    }
    this._router.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.isOver() || this.router.url === '/maps/fullscreen') {
      this.isOpened = false;
    }

    this.route.children.forEach((route: ActivatedRoute) => {
      let activeRoute: ActivatedRoute = route;
      while (activeRoute.firstChild) {
        activeRoute = activeRoute.firstChild;
      }
      this.options = activeRoute.snapshot.data;
    });

    if (this.options) {
      if (this.options.hasOwnProperty('heading')) {
        this.setTitle(this.options.heading);
      }
    }
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle('Affinity |  ' + newTitle);
  }

  toogleSidebar(): void {
    if (this._mode !== 'dock') {
      this.isOpened = !this.isOpened;
    }
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 991px)`).matches;
  }

  openSearch(search) {
    this.modalService.open(search, {windowClass: 'search', backdrop: false});
  }

  addMenuItem(): void {
    this.menuItems.add({
      state: 'menu',
      name: 'MENU',
      type: 'sub',
      icon: 'basic-webpage-txt',
      children: [{state: 'menu', name: 'MENU'}, {state: 'menu', name: 'MENU'}]
    });
  }

  //Remove the list of the caregiver/clients
  removeLink(data) {
    // var citrus = this.leftLinks.slice(id);
    // for (var i = 0; i < this.leftLinks.length; i++) {
    //   if (this.leftLinks[i].hasOwnProperty('client_id')) {
    //     if (this.leftLinks[i].client_id === id) {
    //       this.leftLinks.splice(i, 1);
    //     }
    //   }
    // }
    let linkIndex = this.leftLinks.findIndex(val => val.type === data.type);
    if (linkIndex > -1) {
      if (this.leftLinks[linkIndex].link === data.link) {
        this.leftLinks.splice(linkIndex, 1);
      } else {
        let mainLink = this.leftLinks[linkIndex];
        let subIndex = mainLink.subLinks.findIndex(val => val.link === data.link);
        if (subIndex > -1) {
          mainLink.subLinks.splice(subIndex, 1);
        }
      }
    }
  }
}
