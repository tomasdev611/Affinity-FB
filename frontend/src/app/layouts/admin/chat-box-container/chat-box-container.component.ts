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
import {Observable, Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators';
import * as fromRoot from '../../../states/reducers';
// import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
// import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// import {select, Store} from '@ngrx/store';

// import {MenuItems} from '../../shared/menu-items/menu-items';
// import {Subscription} from 'rxjs';

// import {TranslateService} from '@ngx-translate/core';
// import {AuthService} from '../../services/gaurd/auth.service';
import {MessageService} from '../../../services/db/message.service';

@Component({
  selector: 'app-chat-box-container',
  templateUrl: './chat-box-container.component.html',
  styleUrls: ['./chat-box-container.component.scss']
})
export class ChatBoxContainer implements OnInit, OnDestroy, AfterViewInit {
  instances = [];
  $commonInfo: Observable<any>;
  templates = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private messageService: MessageService, private store: Store<any>) {}

  ngOnInit(): void {
    this.instances = this.messageService.instances;
    this.$commonInfo = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getCommon)
    );
    this.$commonInfo.subscribe(data => {
      if (data.loaded) {
        if (this.templates !== data.templates) {
          this.templates = data.templates;
        }
      }
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  closeChatBox(instance) {
    this.messageService.removeInstance(instance);
  }
}
