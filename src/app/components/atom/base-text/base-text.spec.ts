import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseText } from './base-text';

describe('BaseText', () => {
  let component: BaseText;
  let fixture: ComponentFixture<BaseText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
