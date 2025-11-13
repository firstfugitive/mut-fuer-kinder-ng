import { Component, computed, input, Type } from '@angular/core';
import { PageContent } from '../page-content';
import { PageFooter } from '../../components/organism/page-footer/page-footer';
import { PageHeader } from '../../components/organism/page-header/page-header';
import { CfPageContentHome } from '../../models/contentful-content-types/page-content';
import { Asset } from 'contentful';
import { NgComponentOutlet, NgOptimizedImage } from '@angular/common';
import { getImageUrl } from '../../components/shared/utils';
import { BaseText } from "../../components/atom/base-text/base-text";

@Component({
  selector: 'app-page-content-home',
  imports: [PageFooter, PageHeader, NgComponentOutlet, NgOptimizedImage, BaseText],
  templateUrl: './page-content-home.html',
  styleUrl: './page-content-home.scss'
})
export class PageContentHome extends PageContent {
  override pageContent = input<CfPageContentHome>();

  heroImage = computed<Asset>(() => this.pageContent()?.fields?.heroImage);
  heroImageSrc = computed<string>(() => getImageUrl(this.heroImage()));
  heroImageTitle = computed<string>(() => this.heroImage()?.fields?.title.toString());
  heroHeadline = computed<string>(() => this.pageContent()?.fields?.heroHeadline);
  heroSubline = computed<string>(() => this.pageContent()?.fields?.heroSubline);
  claim = computed<string>(() => this.pageContent()?.fields?.claim);
  aboutUs = computed<string>(() => this.pageContent()?.fields?.aboutUs);

}


