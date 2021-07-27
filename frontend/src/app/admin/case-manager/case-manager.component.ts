import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CasemanagerService } from '../../services/db/casemanager.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-case-manager',
  templateUrl: './case-manager.component.html',
  styleUrls: ['./case-manager.component.css']
})
export class CaseManagerComponent implements OnInit {

  rows = [];
  temp = [];
  selected = [];

  //for fetch the localstroge data(auth token and current db version)
  /**
   *
   * @param clientService
   */
  constructor(private casemanagerService: CasemanagerService, private router: Router) {
    this.casemanagerService.getAll({}).subscribe((data) => {
        this.temp = [...data];
        this.rows = data;
      },
      err => console.log(err)
    );

  }
  ngOnInit() {
  }

}


