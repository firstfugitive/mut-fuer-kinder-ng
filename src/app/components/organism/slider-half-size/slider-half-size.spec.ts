import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderHalfSize } from './slider-half-size';

describe('SliderHalfSize', () => {
  let component: SliderHalfSize;
  let fixture: ComponentFixture<SliderHalfSize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderHalfSize]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderHalfSize);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
