import {Component, OnInit} from '@angular/core';
import {AfterViewInit} from '@angular/core/src/metadata/lifecycle_hooks';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit, AfterViewInit {
  constructor(private appComponent: AppComponent) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // this.appComponent.leftLink();
  }
}
