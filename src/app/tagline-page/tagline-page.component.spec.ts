import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaglinePageComponent } from './tagline-page.component';

describe('TaglinePageComponent', () => {
  let component: TaglinePageComponent;
  let fixture: ComponentFixture<TaglinePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaglinePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaglinePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
