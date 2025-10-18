import { ChangeDetectionStrategy, Component, computed, input, Type } from '@angular/core';
import { PageContent } from '../page-content';
import { PageFooter } from '../../components/organism/page-footer/page-footer';
import { PageHeader } from '../../components/organism/page-header/page-header';
import { CfPageContentBlogHome } from '../../models/contentful-content-types/page-content';
import { Asset } from 'contentful';
import { BaseImage } from "../../components/atom/base-image/base-image";
import { NgComponentOutlet } from '@angular/common';
import { MarkdownText } from "../../components/molecule/markdown-text/markdown-text";

@Component({
  selector: 'app-page-content-home',
  imports: [PageFooter, PageHeader, BaseImage, NgComponentOutlet],
  templateUrl: './page-content-home.html',
  styleUrl: './page-content-home.scss'
})
export class PageContentHome extends PageContent {
  elementsIndices = [1,2,3]
  pageContent = input<CfPageContentBlogHome>();

  firstHeroImage = computed<Asset>(() => this.pageContent()?.fields?.heroImages[0]);
  contentElements = computed<ContentElementData[]>(() => {
    let contentElements: ContentElementData[] = []
    for (const entry of this.pageContent()?.fields?.content) {
      contentElements.push({
        component: this.getComponentOfEntry(entry),
        inputs: {
          data: entry
        }
      });
    }
    return contentElements;
  });
}

export interface ContentElementData {
  component: Type<void>;
  inputs: {
    data: any;
  };
}
