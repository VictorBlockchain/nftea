import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CafeRoomComponent } from './cafe.component';

describe('CafeRoomComponent', () => {
  let component: CafeRoomComponent;
  let fixture: ComponentFixture<CafeRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafeRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafeRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
