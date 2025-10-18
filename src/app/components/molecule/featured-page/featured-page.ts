import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { CfFeaturedPage } from '../../../models/contentful-content-types/featured-page';
import { CfMarkdownText } from '../../../models/contentful-content-types/markdown-text';
import { getImageUrl, getUrlFromPage } from '../../shared/utils';
import { CfPage } from '../../../models/contentful-content-types/page';
import { TextModule } from '../../organism/text-module/text-module';
import { MarkdownText } from '../markdown-text/markdown-text';
import { CfTextModule } from '../../../models/contentful-content-types/text-module';
import { RouterModule } from '@angular/router';
import { BaseText } from '../../atom/base-text/base-text';

@Component({
  selector: 'app-featured-page',
  imports: [MarkdownText, RouterModule, BaseText],
  templateUrl: './featured-page.html',
  styleUrl: './featured-page.scss',
  host: {
    class: "featured-page-background",
    '[style]': 'this.getBackgroundImageStyle(this.pageImageUrl())'
  },
  encapsulation: ViewEncapsulation.None
})
export class FeaturedPage {
  data = input<CfFeaturedPage>();

  headline = computed<string>(() => this.data()?.fields?.headline);
  text = computed<CfMarkdownText>(() => this.data()?.fields?.text);
  pageLink = computed<string>(() => getUrlFromPage(this.data()?.fields?.page));
  pageImageUrl = computed<string>(() => getImageUrl(this.data()?.fields?.page?.fields?.content?.fields['image']));
  linkText = computed<string>(() => this.data()?.fields?.linkText);

  isSafari = false;
  textModuleHeadlineData = computed<CfTextModule>(() => ({
    fields: {
      text: this.headline(),
      big: true,
      bold: true,
      headline: true,
      gotham: true,
      align: 'center',
      htmlTag: 'h3'
    }
  }));

  getBackgroundImageStyle(pageImageUrl) {
        if(!pageImageUrl) return '';
        if(this.isSafari) {
            return `background-image: url('${pageImageUrl}?w=1000');`;
        } else {
            return `background-image: image-set(url('${pageImageUrl}?w=720&fm=webp') 1x type('image/webp'), url('${pageImageUrl}?w=1400&fm=webp') 2x type('image/webp'));`
        }
    }
}
