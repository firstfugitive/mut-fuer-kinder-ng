import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PageContent } from '../page-content';
import { PageFooter } from "../../components/organism/page-footer/page-footer";
import { CfPageContentBlog } from '../../models/contentful-content-types/page-content';
import { PageHeader } from '../../components/organism/page-header/page-header';
import { Asset } from 'contentful';
import { NgComponentOutlet, NgOptimizedImage } from '@angular/common';
import { getImageUrl } from '../../components/shared/utils';

@Component({
  selector: 'app-page-content-blog',
  imports: [PageFooter, PageHeader, NgComponentOutlet, NgOptimizedImage],
  templateUrl: './page-content-blog.html',
  styles: `
    @use "../../styles/placeholder.scss" as *;

    :host {
        @extend %heroImage;
    }
  `
})
export class PageContentBlog extends PageContent {
  override pageContent = input<CfPageContentBlog>();

  heroImage = computed<Asset>(() => this.pageContent()?.fields?.image);
  heroImageSrc = computed<string>(() => getImageUrl(this.heroImage()));
  heroImageTitle = computed<string>(() => this.heroImage()?.fields?.title.toString());

}
