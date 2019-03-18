import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenricSearchComponent } from './genric-search.component';

describe('GenricSearchComponent', () => {
  let component: GenricSearchComponent;
  let fixture: ComponentFixture<GenricSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenricSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenricSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
