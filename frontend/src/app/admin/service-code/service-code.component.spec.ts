import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCodeComponent } from './service-code.component';

describe('ServiceCodeComponent', () => {
  let component: ServiceCodeComponent;
  let fixture: ComponentFixture<ServiceCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
