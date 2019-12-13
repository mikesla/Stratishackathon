import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTicketComponent } from './send-ticket.component';

describe('SendTicketComponent', () => {
  let component: SendTicketComponent;
  let fixture: ComponentFixture<SendTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
