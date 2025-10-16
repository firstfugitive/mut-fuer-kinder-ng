import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PageContent } from '../page-content';
import { PageFooter } from "../../components/organism/page-footer/page-footer";
import { CfPageContentBlog } from '../../models/contentful-content-types/page-content';
import { PageHeader } from '../../components/organism/page-header/page-header';

@Component({
  selector: 'app-page-content-blog',
  imports: [PageFooter, PageHeader],
  templateUrl: './page-content-blog.html',
  styleUrl: './page-content-blog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageContentBlog extends PageContent {
  pageContent = input<CfPageContentBlog>();

}
