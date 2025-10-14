import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContentBlog } from './page-content-blog';

describe('PageContentBlog', () => {
  let component: PageContentBlog;
  let fixture: ComponentFixture<PageContentBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageContentBlog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageContentBlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
