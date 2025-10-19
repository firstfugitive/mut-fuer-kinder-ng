import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContentBlogOverview } from './page-content-blog-overview';

describe('PageContentBlogOverview', () => {
  let component: PageContentBlogOverview;
  let fixture: ComponentFixture<PageContentBlogOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageContentBlogOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageContentBlogOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
