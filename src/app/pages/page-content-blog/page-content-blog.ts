import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PageContent } from '../page-content';
import { PageFooter } from "../../components/organism/page-footer/page-footer";
import { CfPageContentBlog } from '../../models/contentful-content-types/page-content';
import { PageHeader } from '../../components/organism/page-header/page-header';
import { Asset } from 'contentful';
import { BaseImage } from '../../components/atom/base-image/base-image';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-page-content-blog',
  imports: [PageFooter, PageHeader, BaseImage, NgComponentOutlet],
  templateUrl: './page-content-blog.html',
  styleUrl: './page-content-blog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageContentBlog extends PageContent {
  override pageContent = input<CfPageContentBlog>();

  heroImage = computed<Asset>(() => this.pageContent()?.fields?.image);

}
