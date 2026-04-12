import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsDisplay } from './event-details-display';

describe('EventDetailsDisplay', () => {
  let component: EventDetailsDisplay;
  let fixture: ComponentFixture<EventDetailsDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDetailsDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
