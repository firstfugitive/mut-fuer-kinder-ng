import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonModule } from './button-module';

describe('ButtonModule', () => {
  let component: ButtonModule;
  let fixture: ComponentFixture<ButtonModule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonModule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
