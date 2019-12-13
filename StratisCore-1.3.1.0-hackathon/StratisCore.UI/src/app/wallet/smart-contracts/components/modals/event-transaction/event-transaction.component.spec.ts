import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTransactionComponent } from './event-transaction.component';

describe('EventTransactionComponent', () => {
  let component: EventTransactionComponent;
  let fixture: ComponentFixture<EventTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
