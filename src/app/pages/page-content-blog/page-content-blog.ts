import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PageContent } from '../page-content';
import { PageFooter } from "../../components/organism/page-footer/page-footer";
import { CfPageContentBlog } from '../../models/contentful-content-types/page-content';

@Component({
  selector: 'app-page-content-blog',
  imports: [PageFooter],
  templateUrl: './page-content-blog.html',
  styleUrl: './page-content-blog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageContentBlog extends PageContent {
  @Input() data: CfPageContentBlog;

}
