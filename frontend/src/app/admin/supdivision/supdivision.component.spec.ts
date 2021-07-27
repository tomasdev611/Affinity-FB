import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupDivision } from './supdivision.component';

describe('CaseManagerComponent', () => {
  let component: SupDivision;
  let fixture: ComponentFixture<SupDivision>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupDivision ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupDivision);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
