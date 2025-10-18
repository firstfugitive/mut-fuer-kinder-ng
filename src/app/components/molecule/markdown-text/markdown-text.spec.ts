import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownText } from './markdown-text';

describe('MarkdownText', () => {
  let component: MarkdownText;
  let fixture: ComponentFixture<MarkdownText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkdownText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
