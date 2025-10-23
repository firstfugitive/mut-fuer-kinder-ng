import { Component, computed, input } from '@angular/core';
import { CfPageFooter } from '../../../models/contentful-content-types/page-footer';
import { getUrlFromPage } from '../../shared/utils';
import { BaseText } from "../../atom/base-text/base-text";
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-page-footer',
  imports: [BaseText, RouterModule, MatButtonModule],
  templateUrl: './page-footer.html',
  styleUrl: './page-footer.scss'
})
export class PageFooter {
  data = input<CfPageFooter>();

  copyright = computed<string>(() => this.data().fields?.copyright);
  imprintLink = computed<string>(() => getUrlFromPage(this.data().fields?.imprint));
  dataProtectionLink = computed<string>(() => getUrlFromPage(this.data().fields?.dataProtection));
}
