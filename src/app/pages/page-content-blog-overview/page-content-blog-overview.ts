import { Component, computed, input } from '@angular/core';
import { PageContent } from '../page-content';
import { CfPageContentBlogOverview } from '../../models/contentful-content-types/page-content';
import { PageFooter } from '../../components/organism/page-footer/page-footer';
import { PageHeader } from '../../components/organism/page-header/page-header';
import { BaseText } from '../../components/atom/base-text/base-text';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-page-content-blog-overview',
  imports: [PageFooter, PageHeader, BaseText, NgComponentOutlet],
  templateUrl: './page-content-blog-overview.html',
  styleUrl: './page-content-blog-overview.scss'
})
export class PageContentBlogOverview extends PageContent {
  override pageContent = input<CfPageContentBlogOverview>();

  headline = computed<string>(() => this.pageContent()?.fields?.headline);
}
