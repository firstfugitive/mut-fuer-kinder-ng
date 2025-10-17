import { ChangeDetectionStrategy, Component, computed, input, Type } from '@angular/core';
import { PageContent } from '../page-content';
import { PageFooter } from '../../components/organism/page-footer/page-footer';
import { PageHeader } from '../../components/organism/page-header/page-header';
import { CfPageContentBlogHome } from '../../models/contentful-content-types/page-content';
import { Asset } from 'contentful';
import { BaseImage } from "../../components/atom/base-image/base-image";
import { CfTextModule } from '../../models/contentful-content-types/text-module';
import { NgComponentOutlet } from '@angular/common';
import { getContentTypeFromEntry } from '../../components/shared/util';

@Component({
  selector: 'app-page-content-home',
  imports: [PageFooter, PageHeader, BaseImage, NgComponentOutlet],
  templateUrl: './page-content-home.html',
  styleUrl: './page-content-home.scss'
})
export class PageContentHome extends PageContent {
  pageContent = input<CfPageContentBlogHome>();

  firstHeroImage = computed<Asset>(() => this.pageContent()?.fields?.heroImages[0]);
  secondContentElement = computed<ContentElementData>(() => {
    return {
      component: this.getComponentOfEntry(this.pageContent()),
      inputs: {
        data: this.pageContent()?.fields?.content[1]
      }
    }
  });
}

export interface ContentElementData {
  component: Type<void>;
  inputs: {
    data: any;
  };
}
