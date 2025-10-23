import { Component, computed, input, Input } from '@angular/core';
import { CfPageHeader } from '../../../models/contentful-content-types/page-header';
import { getUrlFromPage } from '../../shared/utils';
import { CfNavigationElement } from '../../../models/contentful-content-types/navigation-element';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-page-header',
  imports: [MatButtonModule, RouterModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss'
})
export class PageHeader {
  data = input<CfPageHeader>();
  fullPath = input<string>();

  menuActive = false;

  title = computed<string>(() => this.data()?.fields?.title);
  linkHome = computed<string>(() => getUrlFromPage(this.data()?.fields?.linkHome));
  linkDonate = computed<string>(() => getUrlFromPage(this.data()?.fields?.linkDonate));
  navigationElements = computed<CfNavigationElement[]>(() => this.data()?.fields?.navigationElements)

constructor(private router: Router) {
  this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.menuActive = false;
      });
  }

  pageHeaderToggleMenu(event: MouseEvent) {
    event.preventDefault();
    this.menuActive = !this.menuActive;
  }

  getNavElementUrl(element: CfNavigationElement) {
    const linkPage = element?.fields?.link;
    return getUrlFromPage(linkPage);
  }

  getNavElementUrlText(element: CfNavigationElement) {
    return element?.fields?.title;
  }
}
