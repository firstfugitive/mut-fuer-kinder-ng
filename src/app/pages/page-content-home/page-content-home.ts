import { Component, computed, input, Type } from '@angular/core';
import { PageContent } from '../page-content';
import { PageFooter } from '../../components/organism/page-footer/page-footer';
import { PageHeader } from '../../components/organism/page-header/page-header';
import { CfPageContentHome } from '../../models/contentful-content-types/page-content';
import { Asset } from 'contentful';
import { BaseImage } from "../../components/atom/base-image/base-image";
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-page-content-home',
  imports: [PageFooter, PageHeader, BaseImage, NgComponentOutlet],
  templateUrl: './page-content-home.html',
})
export class PageContentHome extends PageContent {
  override pageContent = input<CfPageContentHome>();

  firstHeroImage = computed<Asset>(() => this.pageContent()?.fields?.heroImages[0]);
  
}


