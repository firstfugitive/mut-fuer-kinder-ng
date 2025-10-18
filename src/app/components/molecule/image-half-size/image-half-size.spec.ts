import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageHalfSize } from './image-half-size';

describe('ImageHalfSize', () => {
  let component: ImageHalfSize;
  let fixture: ComponentFixture<ImageHalfSize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageHalfSize]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageHalfSize);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
