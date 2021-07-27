import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickbooksComponent } from './quickbooks.component';

describe('QuickbooksComponent', () => {
  let component: QuickbooksComponent;
  let fixture: ComponentFixture<QuickbooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickbooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
