import {Component, ViewChild, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as moment from 'moment';
import {pick, cloneDeep} from 'lodash';
import {AuthService} from '../../../services/gaurd/auth.service';
import {ModalComponent} from '../../../library/custom-modal/modal/modal.component';
import {CACHE_ENABLED} from '../../../config';
import {
  LoadClientNotes,
  CreateClientNotes,
  DeleteClientNotes,
  UpdateClientNotes
} from '../../../states/actions/client.actions';
import * as fromRoot from '../../../states/reducers';

const EmptyNote = {
  Description: '',
  noteTypeID: ''
};

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  clientDetail: any;
  ClientId: string;
  saving: string = '';

  activeModal: ModalComponent;

  // Feb13
  getAllNotes = [];
  filteredNotes = [];
  noteTypeData = [];

  noteTypePipe: any;

  note: any = {
    ...EmptyNote
  };

  NoteDate: any;
  NoteTime: any;
  NoteDateTime: any;

  check_access_on_init = true;
  access_group_id = 'Client Data';
  acl_allow = {read: false, update: false, delete: false};

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngAfterViewChecked() {}

  constructor(private authService: AuthService, private store: Store<any>) {
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
    }
    this.noteTypePipe = {
      transform: noteTypeID => {
        if (this.noteTypeData) {
          let noteType = this.noteTypeData.find(n => n.noteTypeID === noteTypeID);
          if (noteType) {
            return noteType.description;
          }
        }
        return '';
      }
    };
  }

  ngOnInit() {
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getClientSaving)
      )
      .subscribe(data => {
        if (this.saving === 'saving' && data === 'success') {
          if (this.activeModal) {
            this.activeModal.hide();
            this.activeModal = null;
          }
        }
        this.saving = data;
      });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCommon)
      )
      .subscribe(data => {
        if (data.loaded) {
          if (this.noteTypeData !== data.clientNoteTypes) {
            this.noteTypeData = data.clientNoteTypes;
            this.filteredNotes = cloneDeep(this.filteredNotes);
          }
        }
      });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getClientDetailMap)
      )
      .subscribe(data => {
        if (!CACHE_ENABLED && this.ClientId !== data.currentClientId) {
          this.store.dispatch(new LoadClientNotes(data.currentClientId));
        }
        this.ClientId = data.currentClientId;
        this.clientDetail = data[this.ClientId];
        if (this.clientDetail) {
          if (this.clientDetail.notes) {
            if (this.getAllNotes !== this.clientDetail.notes) {
              this.getAllNotes = this.clientDetail.notes;
              this.filteredNotes = this.getAllNotes;
            }
          } else {
            if (CACHE_ENABLED) {
              this.store.dispatch(new LoadClientNotes(this.ClientId));
            }
          }
        }
      });
  }

  getNoteType(row) {
    if (this.noteTypeData) {
      let noteType = this.noteTypeData.find(n => n.noteTypeID === row.noteTypeID);
      if (noteType) {
        return noteType.description;
      }
    }
    return '';
  }

  // Feb - 13
  // open model for add note
  newAddNoteAction(content) {
    this.note = {...EmptyNote};
    this.NoteDate = null;
    content.show();
    this.activeModal = content;
  }

  // post add new note data on server
  AddNewNote() {
    this.store.dispatch(
      new CreateClientNotes({
        ClientId: this.ClientId,
        data: this.note
      })
    );
  }

  // for update Note
  noteUpdateAction(content, row) {
    this.NoteDate = row.NoteDate;
    this.NoteTime = row.NoteTime;
    this.NoteDateTime = moment(row.convertedTime).format('YYYY-MM-DDTHH:mm');
    this.note = {
      ...pick(row, ['Description', 'noteTypeID']),
      NoteDateTime: this.NoteDateTime
    };
    content.show();
    this.activeModal = content;
  }

  // open model for Delete Note
  noteDeleteAction(content, row) {
    this.NoteDate = row.NoteDate;
    this.NoteTime = row.NoteTime;
    content.show();
    this.activeModal = content;
  }

  // for delete client Note
  deleteNote() {
    this.store.dispatch(
      new DeleteClientNotes({
        ClientId: this.ClientId,
        NoteDate: this.NoteDate,
        NoteTime: this.NoteTime
      })
    );
  }
  // for update client  Note on server
  updateNote() {
    const updateData: any = {
      Description: this.note.Description,
      noteTypeID: this.note.noteTypeID
    };
    if (this.note.NoteDateTime !== this.NoteDateTime) {
      updateData.NoteDateTime = new Date(this.note.NoteDateTime).toISOString(); // `${this.note.NoteDateTime}:00.000Z`;
    }
    this.store.dispatch(
      new UpdateClientNotes({
        ClientId: this.ClientId,
        NoteDate: this.NoteDate,
        NoteTime: this.NoteTime,
        data: updateData
      })
    );
  }

  saveNote() {
    if (this.NoteDate) {
      this.updateNote();
    } else {
      this.AddNewNote();
    }
  }

  sortDateCompare(propA, propB, rowA, rowB, sortDirection) {
    let result = 0;
    if (rowA.created > rowB.created) {
      result = 1;
    } else {
      result = -1;
    }
    return result; // * (sortDirection === 'asc' ? 1 : -1);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    if (!val) {
      this.filteredNotes = this.getAllNotes;
      return;
    }
    // filter our data
    const temp = this.getAllNotes.filter(function(d) {
      return (
        d.Description.toLowerCase().indexOf(val) !== -1 ||
        d.createdBy.toLowerCase().indexOf(val) !== -1
      );
    });
    // update the rows
    this.filteredNotes = temp;
  }
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
