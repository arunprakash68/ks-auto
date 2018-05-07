import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketLocationDashboardComponent } from './ticket-location-dashboard.component';

describe('TicketLocationDashboardComponent', () => {
  let component: TicketLocationDashboardComponent;
  let fixture: ComponentFixture<TicketLocationDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketLocationDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketLocationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
