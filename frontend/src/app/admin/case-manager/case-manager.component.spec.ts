import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseManagerComponent } from './case-manager.component';

describe('CaseManagerComponent', () => {
  let component: CaseManagerComponent;
  let fixture: ComponentFixture<CaseManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
