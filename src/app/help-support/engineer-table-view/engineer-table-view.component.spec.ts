import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerTableViewComponent } from './engineer-table-view.component';

describe('EngineerTableViewComponent', () => {
  let component: EngineerTableViewComponent;
  let fixture: ComponentFixture<EngineerTableViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineerTableViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
