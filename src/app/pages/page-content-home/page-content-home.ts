import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PageContent } from '../page-content';
import { PageFooter } from '../../components/organism/page-footer/page-footer';
import { PageHeader } from '../../components/organism/page-header/page-header';
import { CfPageContentBlogHome } from '../../models/contentful-content-types/page-content';
import { Asset } from 'contentful';
import { BaseImage } from "../../components/atom/base-image/base-image";

@Component({
  selector: 'app-page-content-home',
  imports: [PageFooter, PageHeader, BaseImage],
  templateUrl: './page-content-home.html',
  styleUrl: './page-content-home.scss'
})
export class PageContentHome extends PageContent {
  pageContent = input<CfPageContentBlogHome>();

  firstHeroImage = computed<Asset>(() => this.pageContent()?.fields?.heroImages[0]);
}
