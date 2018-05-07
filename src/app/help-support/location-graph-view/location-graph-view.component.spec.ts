import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationGraphViewComponent } from './location-graph-view.component';

describe('LocationGraphViewComponent', () => {
  let component: LocationGraphViewComponent;
  let fixture: ComponentFixture<LocationGraphViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationGraphViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationGraphViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
