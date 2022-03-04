import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeapassComponent } from './cafe.component';

describe('TeapassComponent', () => {
  let component: TeapassComponent;
  let fixture: ComponentFixture<TeapassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeapassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeapassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
