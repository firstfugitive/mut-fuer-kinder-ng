import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CfPageFooter } from '../../../models/contentful-content-types/page-footer';
import { getUrlFromPage } from '../../shared/Util';
import { DynamicPageRoutingModule } from "../../../pages/dynamic-page/dynamic-page.routing.module";
import { BaseText } from "../../atom/base-text/base-text";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-footer',
  imports: [DynamicPageRoutingModule, BaseText, RouterModule],
  templateUrl: './page-footer.html',
  styleUrl: './page-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageFooter {
  //todo make signal
  @Input() data: CfPageFooter;

  get copyright() {
    return this.data?.fields?.copyright;
  }

  get imprintLink() {
    const pageObject = this.data?.fields?.imprint;
    return getUrlFromPage(pageObject);
  }

  get dataProtectionLink() {
    const pageObject = this.data?.fields?.dataProtection;
    return getUrlFromPage(pageObject);
  }
}
