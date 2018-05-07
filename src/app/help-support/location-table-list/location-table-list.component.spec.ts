import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTableListComponent } from './location-table-list.component';

describe('LocationTableListComponent', () => {
  let component: LocationTableListComponent;
  let fixture: ComponentFixture<LocationTableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationTableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
