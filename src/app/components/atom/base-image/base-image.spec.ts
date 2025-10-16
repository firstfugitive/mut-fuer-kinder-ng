import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseImage } from './base-image';

describe('BaseImage', () => {
  let component: BaseImage;
  let fixture: ComponentFixture<BaseImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
