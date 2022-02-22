import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RafflePlayComponent } from './rafflePlay.component';

describe('RafflePlayComponent', () => {
  let component: RafflePlayComponent;
  let fixture: ComponentFixture<RafflePlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RafflePlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RafflePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
