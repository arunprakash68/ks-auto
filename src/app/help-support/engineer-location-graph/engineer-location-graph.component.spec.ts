import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerLocationGraphComponent } from './engineer-location-graph.component';

describe('EngineerLocationGraphComponent', () => {
  let component: EngineerLocationGraphComponent;
  let fixture: ComponentFixture<EngineerLocationGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineerLocationGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerLocationGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
