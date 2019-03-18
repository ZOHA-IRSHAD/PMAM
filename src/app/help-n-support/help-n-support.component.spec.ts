import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpNSupportComponent } from './help-n-support.component';

describe('HelpNSupportComponent', () => {
  let component: HelpNSupportComponent;
  let fixture: ComponentFixture<HelpNSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpNSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpNSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
