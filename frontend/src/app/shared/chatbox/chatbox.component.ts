import * as moment from 'moment';
import {catchError, debounceTime, map, distinctUntilChanged} from 'rxjs/operators';
import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  ViewChild,
  TemplateRef,
  EventEmitter,
  AfterViewInit,
  Input,
  Output,
  ElementRef
} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {NotifierService} from 'angular-notifier';

import {DOCUMENT} from '@angular/platform-browser';

import {ActivatedRoute, Params, ROUTER_CONFIGURATION} from '@angular/router';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';

import {AuthService} from '../../services/gaurd/auth.service';
import {MessageService} from '../../services/db/message.service';
import {getErrorMessage, s3UrlFor} from '../../utils/helpers';

@Component({
  selector: 'chatbox-component',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatboxComponent implements AfterViewInit {
  @Input() options: any;
  @Input() templates: any[];
  @Output() closeChatBox: EventEmitter<any> = new EventEmitter();
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chatTitle = 'Chat with';
  messages = [];
  target: any = {};
  // templates = [];
  templateId = null;
  messageInput = '';
  targetName = '';
  RoomId = '';
  chatAllowed = true;
  noPreviousMessage = true;
  loading = false;
  sending = false;
  caregiver = null;
  group: any = null;
  loadTimer: any;
  imageData: any;
  filesToUpload: any;

  check_access_on_init = true;
  access_group_id = 'Scheduling - Calendar';
  acl_allow = {read: false, update: false, delete: false};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private store: Store<any>,
    private messageService: MessageService,
    private notifierService: NotifierService,
    @Inject(DOCUMENT) doc: any
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = this.authService.checkOverallAccess(this.access_group_id);
      if (!this.acl_allow.read) {
        this.router.navigate(['/admin/page404']);
      }
    }
  }

  ngOnInit() {
    if (this.options) {
      const {caregiver, group, RoomId} = this.options;
      if (caregiver) {
        this.chatTitle = `Chat with ${caregiver.FirstName}`;
        this.targetName = caregiver.FirstName;
        this.target.Phone = caregiver.Phone1;
        this.target.type = 'caregiver';
        this.caregiver = caregiver;
        this.target.SocialSecurityNum = caregiver.SocialSecurityNum;
        this.chatAllowed = RoomId.startsWith(localStorage.getItem('username'));
        this.RoomId = RoomId;
      } else if (group) {
        this.chatTitle = `Group Chat: ${group.name} (${group.groupSize} members)`;
        this.target.GroupId = group.GroupId;
        this.RoomId = RoomId;
        this.target.type = 'group';
        this.chatAllowed = true;
        this.group = group;
      }
    }
    this.fetchMessages();
    this.loadTimer = setInterval(() => {
      this.fetchMessages();
    }, 10000); // Check every 5 seconds
    // this.fetchSchedules(true);
  }

  async loadPreviousMessages() {
    this.fetchMessages(true);
  }

  async fetchMessages(loadPrevious = false) {
    if (this.loading) {
      return;
    }
    const self = this;
    const fetchOption = {...this.target, RoomId: this.RoomId, loadPrevious};
    if (this.messages.length > 0) {
      if (loadPrevious) {
        const lastMessage = this.messages[0];
        fetchOption.lastMessageId = lastMessage.MessageId;
      } else {
        const lastMessage = this.messages[this.messages.length - 1];
        fetchOption.lastMessageId = lastMessage.MessageId;
      }
    }
    this.loading = true;
    this.messageService.getAllMessageWithOption(fetchOption).subscribe(
      data => {
        self.loading = false;
        // self.messages = [...self.messages, ...data.messages.reverse()];
        if (loadPrevious) {
          if (data.messages && data.messages.length > 0) {
            self.messages = [...data.messages.reverse(), ...self.messages];
            // chat-body
            this.noPreviousMessage = data.noPreviousMessage;
            setTimeout(() => {
              self.scrollToTop();
            }, 200);
          } else {
            this.noPreviousMessage = true;
          }
        } else {
          if (data.messages && data.messages.length > 0) {
            self.messages.push(...data.messages.reverse());
            // chat-body
            if (!fetchOption.lastMessageId) {
              this.noPreviousMessage = data.noPreviousMessage;
            }
            setTimeout(() => {
              self.scrollToBottom();
            }, 200);
          }
        }
      },
      error => {
        self.loading = false;
      }
    );
  }

  async sendMessage() {
    let file;
    if (this.filesToUpload) {
      file = this.filesToUpload;
    }
    if (!this.messageInput && !file) {
      return;
    }
    const self = this;
    var formData: any = new FormData();
    // const data = {
    //   target: this.target,
    //   message: this.messageInput
    // };
    if (this.target.SocialSecurityNum) {
      formData.append('target', this.target.SocialSecurityNum);
    }
    if (this.target.GroupId) {
      formData.append('GroupId', this.target.GroupId);
    }
    formData.append('targetType', this.target.type);
    formData.append('RoomId', this.RoomId);
    formData.append('message', this.messageInput || '');

    if (file) {
      var extension = file.name.substr(file.name.length - 4);
      let img_text = new Date().getTime() + localStorage.getItem('id') + extension;
      formData.append('file', file, img_text);
    }
    this.sending = true;
    this.messageService.sendNewMessage(formData).subscribe(
      data => {
        self.sending = false;
        self.messageInput = '';
        self.filesToUpload = null;
        self.imageData = null;
        self.fetchMessages();
      },
      error => {
        console.error('ERRR', error);
        this.notifierService.notify('error', `${getErrorMessage(error)}`);
        self.sending = false;
      }
    );
  }

  getPhoto(message) {
    if (message.sender === 'C') {
      if (this.caregiver && this.caregiver.photo) {
        return s3UrlFor(this.caregiver.photo);
      }
      return '/assets/images/unsplash/edit_profile.svg';
    } else {
    }
    return '/assets/images/unsplash/User_comp.png';
  }

  formatDate(dt) {
    return moment(dt).format('MM/DD/YYYY hh:mm a');
  }

  ngAfterViewInit() {
    // if (this.selectClient === ' ' && this.SocialSecNum === undefined) {
    //   this.appComponent.leftLink();
    // }
  }
  // for closing the modal when move another component
  ngOnDestroy() {
    if (this.loadTimer) {
      clearInterval(this.loadTimer);
      this.loadTimer = null;
    }
  }

  uploadFile() {}

  closeModalClick() {
    this.closeChatBox.emit(this.options);
  }

  scrollToTop(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = 0; // this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
  removePhoto() {
    this.filesToUpload = null;
    this.imageData = null;
  }
  sendImage(event) {
    if (event.target.files) {
      const file = event.target.files[0];
      this.filesToUpload = file;
      if (file.type === 'application/pdf') {
        this.imageData = '/assets/images/pdf-file.png';
      } else {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageData = event.target.result;
          // this.uploadProfile();
        };
        reader.readAsDataURL(file);
      }
      event.target.value = '';
    }
  }
  showFullPhoto(event) {}

  onTemplateChange() {
    if (this.templateId) {
      const template = this.templates.find(t => t.id === this.templateId);
      if (template) {
        let message = template.message;
        message = message.split('[name]').join(this.targetName);
        this.messageInput = message;
      }
      setTimeout(() => {
        this.templateId = undefined;
      }, 100);
    }
  }
}
