import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesearchresultComponent } from './imagesearchresult.component';

describe('ImagesearchresultComponent', () => {
  let component: ImagesearchresultComponent;
  let fixture: ComponentFixture<ImagesearchresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesearchresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesearchresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
