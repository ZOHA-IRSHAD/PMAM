import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiosComponent } from './audios.component';

describe('AudiosComponent', () => {
  let component: AudiosComponent;
  let fixture: ComponentFixture<AudiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
