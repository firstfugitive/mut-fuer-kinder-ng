import { Component, computed, input, OnInit } from '@angular/core';
import { PageContent } from '../page-content';
import { CfPageContentBlog, CfPageContentBlogOverview } from '../../models/contentful-content-types/page-content';
import { PageFooter } from '../../components/organism/page-footer/page-footer';
import { PageHeader } from '../../components/organism/page-header/page-header';
import { BaseText } from '../../components/atom/base-text/base-text';
import { NgComponentOutlet } from '@angular/common';
import { contentfulClient } from '../../components/shared/contentful';
import { CfPage } from '../../models/contentful-content-types/page';
import { BlogTeaser } from '../../components/molecule/blog-teaser/blog-teaser';

@Component({
  selector: 'app-page-content-blog-overview',
  imports: [PageFooter, PageHeader, BaseText, NgComponentOutlet, BlogTeaser],
  templateUrl: './page-content-blog-overview.html',
  styleUrl: './page-content-blog-overview.scss'
})
export class PageContentBlogOverview extends PageContent implements OnInit {
  override pageContent = input<CfPageContentBlogOverview>();

  headline = computed<string>(() => this.pageContent()?.fields?.headline);
  blogPages: CfPage[] = [];

  ngOnInit(): void {
    this.fetchBlogs();
  }

  private async fetchBlogs() {
    const blogPages: CfPage[] = await contentfulClient.getEntries({
      content_type: 'page',
      'fields.content.sys.contentType.sys.id': 'pageContentBlog',
      limit: 1000
    }).then((res) => res.items) as CfPage[];
    blogPages.sort((itemA: CfPage, itemB: CfPage) => {
      const dateA = (itemA?.fields?.content as CfPageContentBlog)?.fields?.creationDate;
      const dateB = (itemB?.fields?.content as CfPageContentBlog)?.fields?.creationDate;
      return (dateB < dateA) ? -1 : ((dateB > dateA) ? 1 : 0)
    })
    this.blogPages = blogPages;
  }
}
