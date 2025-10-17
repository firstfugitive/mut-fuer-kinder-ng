import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextModule } from './text-module';

describe('TextModule', () => {
  let component: TextModule;
  let fixture: ComponentFixture<TextModule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextModule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
