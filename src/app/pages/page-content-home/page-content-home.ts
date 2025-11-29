import { Component, computed, input, signal, Type } from '@angular/core';
import { PageContent } from '../page-content';
import { PageFooter } from '../../components/organism/page-footer/page-footer';
import { PageHeader } from '../../components/organism/page-header/page-header';
import { CfPageContentHome } from '../../models/contentful-content-types/page-content';
import { Asset } from 'contentful';
import { NgComponentOutlet, NgOptimizedImage } from '@angular/common';
import { getImageUrl } from '../../components/shared/utils';
import { BaseText } from "../../components/atom/base-text/base-text";
import { sign } from 'node:crypto';
import { SliderProperties } from '../../models/slider-properties';
import { TextSlider } from "../../components/molecule/text-slider/text-slider";

@Component({
  selector: 'app-page-content-home',
  imports: [PageFooter, PageHeader, NgComponentOutlet, NgOptimizedImage, BaseText, TextSlider],
  templateUrl: './page-content-home.html',
  styleUrl: './page-content-home.scss'
})
export class PageContentHome extends PageContent {
  readonly BIG_DIVIDER = "$";
  readonly SMALL_DIVIDER = "/";

  override pageContent = input<CfPageContentHome>();

  heroImage = computed<Asset>(() => this.pageContent()?.fields?.heroImage);
  heroImageSrc = computed<string>(() => getImageUrl(this.heroImage()));
  heroImageTitle = computed<string>(() => this.heroImage()?.fields?.title.toString());
  heroHeadline = computed<string>(() => this.pageContent()?.fields?.heroHeadline);
  heroSubline = computed<string>(() => this.pageContent()?.fields?.heroSubline);
  claim = computed<string>(() => this.pageContent()?.fields?.claim);
  aboutUs = computed<string>(() => this.pageContent()?.fields?.aboutUs);

  claimIsSlider = computed<boolean>(() => this.textIsSlider(this.claim()));
  sliderPropertiesFromClaim = computed<SliderProperties>(() => this.claimIsSlider() ? this.getSliderPropertiesFromClaim() : undefined);

  textIsSlider(text: string): boolean {
    const splitText = text?.split(this.BIG_DIVIDER);
    if(!splitText || splitText.length <= 1) return false;
    const probablySliderItems = splitText[1].split(this.SMALL_DIVIDER);
    return probablySliderItems.length > 1;
  }

  getSliderPropertiesFromClaim(): SliderProperties {
    const splitText = this.claim()?.split(this.BIG_DIVIDER);
    const sliderItems = splitText[1].split(this.SMALL_DIVIDER);
    return {
      beforeSliderText: splitText[0] === " " ? undefined : splitText[0],
      afterSliderText: splitText[2] === " " ? undefined : splitText[2],
      sliderItems: sliderItems
    };
  }
}


