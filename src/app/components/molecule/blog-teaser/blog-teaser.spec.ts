import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogTeaser } from './blog-teaser';

describe('BlogTeaser', () => {
  let component: BlogTeaser;
  let fixture: ComponentFixture<BlogTeaser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogTeaser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogTeaser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
