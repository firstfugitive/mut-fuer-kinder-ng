import { Component, input } from '@angular/core';
import { PageContent } from '../page-content';
import { CfPageContentStandard } from '../../models/contentful-content-types/page-content';
import { PageFooter } from '../../components/organism/page-footer/page-footer';
import { PageHeader } from '../../components/organism/page-header/page-header';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-page-content-standard',
  imports: [PageFooter, PageHeader, NgComponentOutlet],
  templateUrl: './page-content-standard.html',
  styles: `
  .content-standard-spacer {
    min-height: calc(var(--height-header) - 20px);
  }`
})
export class PageContentStandard extends PageContent {
  override pageContent = input<CfPageContentStandard>();

}
