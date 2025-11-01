import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { CfFeaturedPage } from '../../../models/contentful-content-types/featured-page';
import { CfMarkdownText } from '../../../models/contentful-content-types/markdown-text';
import { getImageUrl, getUrlFromPage } from '../../shared/utils';
import { MarkdownText } from '../markdown-text/markdown-text';
import { CfTextModule } from '../../../models/contentful-content-types/text-module';
import { RouterModule } from '@angular/router';
import { BaseText } from '../../atom/base-text/base-text';
import { MatButtonModule } from '@angular/material/button';
import { Asset } from 'contentful';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-featured-page',
  imports: [MarkdownText, RouterModule, BaseText, MatButtonModule, NgOptimizedImage],
  templateUrl: './featured-page.html',
  styleUrl: './featured-page.scss',
  encapsulation: ViewEncapsulation.None
})
export class FeaturedPage {
  data = input<CfFeaturedPage>();

  headline = computed<string>(() => this.data()?.fields?.headline);
  text = computed<CfMarkdownText>(() => this.data()?.fields?.text);
  pageLink = computed<string>(() => getUrlFromPage(this.data()?.fields?.page));
  pageImage = computed<Asset>(() => this.data()?.fields?.page?.fields?.content?.fields['image']);
  pageImageUrl = computed<string>(() => getImageUrl(this.pageImage()));
  pageImageTitle = computed<string>(() => this.pageImage()?.fields?.title.toString());
  linkText = computed<string>(() => this.data()?.fields?.linkText);
  alternativeBackground = computed<boolean>(() => this.data()?.fields?.alternativeBackground);

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
}
