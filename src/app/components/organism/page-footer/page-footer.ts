import { ChangeDetectionStrategy, Component, computed, input, Input } from '@angular/core';
import { CfPageFooter } from '../../../models/contentful-content-types/page-footer';
import { getUrlFromPage } from '../../shared/utils';
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
  data = input<CfPageFooter>();

  copyright = computed<string>(() => this.data().fields?.copyright);
  imprintLink = computed<string>(() => getUrlFromPage(this.data().fields?.imprint));
  dataProtectionLink = computed<string>(() => getUrlFromPage(this.data().fields?.dataProtection));
}
