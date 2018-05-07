import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerGraphViewComponent } from './engineer-graph-view.component';

describe('EngineerGraphViewComponent', () => {
  let component: EngineerGraphViewComponent;
  let fixture: ComponentFixture<EngineerGraphViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineerGraphViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerGraphViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
