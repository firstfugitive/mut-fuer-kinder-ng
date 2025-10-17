import { Component, computed, input, Input } from '@angular/core';
import { CfPageHeader } from '../../../models/contentful-content-types/page-header';
import { DynamicPageRoutingModule } from "../../../pages/dynamic-page/dynamic-page.routing.module";
import { getUrlFromPage } from '../../shared/Util';
import { CfNavigationElement } from '../../../models/contentful-content-types/navigation-element';

@Component({
  selector: 'app-page-header',
  imports: [DynamicPageRoutingModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss'
})
export class PageHeader {
  data = input<CfPageHeader>();
  fullPath = input<string>();

  menuActive = false;

  title = computed<string>(() => this.data()?.fields?.title);
  linkHome = computed<string>(() => getUrlFromPage(this.data()?.fields?.linkHome));
  navigationElements = computed<CfNavigationElement[]>(() => this.data()?.fields?.navigationElements)

  pageHeaderToggleMenu(e) {
    e.preventDefault();
    this.menuActive = !this.menuActive;
  }

  getNavElementUrl(element) {
    let linkPage = element?.fields?.link;
    return getUrlFromPage(linkPage);
  }

  getNavElementUrlText(element) {
    return element?.fields?.title;
  }
}
