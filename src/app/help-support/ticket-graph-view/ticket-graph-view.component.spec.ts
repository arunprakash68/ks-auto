import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketGraphViewComponent } from './ticket-graph-view.component';

describe('TicketGraphViewComponent', () => {
  let component: TicketGraphViewComponent;
  let fixture: ComponentFixture<TicketGraphViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketGraphViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketGraphViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
