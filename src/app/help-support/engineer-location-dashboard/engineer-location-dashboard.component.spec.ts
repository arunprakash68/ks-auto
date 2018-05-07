import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerLocationDashboardComponent } from './engineer-location-dashboard.component';

describe('EngineerLocationDashboardComponent', () => {
  let component: EngineerLocationDashboardComponent;
  let fixture: ComponentFixture<EngineerLocationDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineerLocationDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerLocationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
