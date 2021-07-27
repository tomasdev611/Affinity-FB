import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SuperAdminDivisionService } from '../../services/db/superAdminDivision.service';


@Component({
  selector: 'app-supdivision',
  templateUrl: './supdivision.component.html',
  styleUrls: ['./supdivision.component.css']
})
export class SupDivision implements OnInit {

  // for modal
  public modalRef: NgbModalRef;
  public modalRefContact: NgbModalRef;

  rows = [];  // for all division
  // for add new division 
  dbName :any ; 
  divName :any ;

  addDivSuccessMsg = true; // for add  success message
  deleteDivSuccessMsg = true ; // for delete success msg 
  errorMsg = true ; // for error msg

  divisioID:any ; // for store division id

  username:any;

  /**
   * 
   * @param clientService 
   */
  constructor(private modal: NgbModal, private router: Router,
    private superAdminDivisionService: SuperAdminDivisionService) {
    this.username = localStorage.getItem("username"); 

  }
  ngOnInit() {
    this.fetchDivision();
  }


  // to open modal for add new division
  closeResult: string;

  newDivisionAction(content) {

    this.modalRef = this.modal.open(content, { size: 'lg' });
    this.modalRef.result.then((result) => {
      this.closeResult = "Closed";
    }, (reason) => {
      this.closeResult = "Closed";
    });
  }

  /**
  *   fetch all division from db
  * 
  */
  fetchDivision() {
    this.superAdminDivisionService.getAllSupserAdminDivisions().subscribe(
      data => {
        console.log(data);
        this.rows = data['data'];
      },
      error => {
        console.log(error);
      }
    );
  }

  // for update division
  customFieldUpdate(newCustomFieldUpdate, row) {
    console.log('updating');
  }

  // for delete division
  customFieldDelete(customFieldDeleteModel, row) {
    console.log('daleting');
  }

  // for add new division 
  addNewDivision() {

    let postData = {
      database_name: this.dbName,
      division_name: this.divName

    }

    console.log(postData);

    this.superAdminDivisionService.addNewDivision(postData).subscribe((data) => {
      console.log(data);
      this.addDivSuccessMsg = false;
      setTimeout(() => this.addDivSuccessMsg = true, 5000);
      this.fetchDivision(); // for get updated data

      this.modalRef.close();
      return data;
    },
      error => {
        console.log(error.status);
        this.errorMsg = false;
        setTimeout(() => this.errorMsg = true, 5000);
       

      });
  }

  // for division division 

  deleteDivModal(content,row) {

    this.divisioID = row.division_id;
    console.log(row);
    this.modalRef = this.modal.open(content, { size: 'lg' });
    this.modalRef.result.then((result) => {
      this.closeResult = "Closed";
    }, (reason) => {
      this.closeResult = "Closed";
    });
  }

  
  deleteDivision() {
    let postData = {
      division_id: this.divisioID

    }
    console.log(postData);

    this.superAdminDivisionService.deleteDivision(postData).subscribe((data) => {
      //console.log(data);
      this.deleteDivSuccessMsg = false;
      setTimeout(() => this.deleteDivSuccessMsg = true, 5000);
      this.fetchDivision(); // for get updated data
      this.modalRef.close();
      return data;
    },
      error => {
       // console.log(error.status);
      
       

      });
  }

}


