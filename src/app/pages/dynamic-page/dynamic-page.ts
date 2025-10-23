import { NgComponentOutlet } from '@angular/common';
import { Component, Type } from '@angular/core';
import { CfPage } from '../../models/contentful-content-types/page';
import { CfStandardPageConfig } from '../../models/contentful-content-types/standard-page-config';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, filter } from 'rxjs';
import { pageMock, standardPageConfigMock } from '../../components/shared/mock';
import { getContentTypeFromEntry } from '../../components/shared/utils';
import { mapContentTypePageToComponent } from '../../components/shared/mapping';
import { contentfulClient } from '../../components/shared/contentful';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dynamic-page',
  imports: [NgComponentOutlet],
  template: '<ng-container *ngComponentOutlet="pageComponent; inputs: pageComponentInputs" />',
})
export class DynamicPage {
  mock = false;
  contentType = "";
  fullPath = "";
  pageObject: any;
  pageContent: CfPage;
  standardPageConfig: CfStandardPageConfig;
  pageComponent: Type<any>;
  pageComponentInputs: Record<string, unknown>;

  constructor(private router: Router, private titleTagService: Title, private metaTagService: Meta) {
    this.loadInformationByRoute();
  }

  private loadInformationByRoute() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        debounceTime(200)
      )
      .subscribe((event: NavigationEnd) => {
        const route = event.url === "/" ? "/home" : event.url;
        const pathParts = route.split('/').filter(e => e !== '');
        let slug = pathParts.reverse()[0];
        const urlSubfolder = route.substring(0, route.lastIndexOf(slug));
        slug = slug || 'index';

        console.info('ROUTE', route);
        console.info('URL-SUBFOLDER', urlSubfolder);
        console.info('SLUG', slug);

        this.fullPath = `${urlSubfolder}${slug}`;

        Promise.all([this.getEntriesForPage(slug), this.getStandardPageConfig()])
          .then(() => {
            this.setPageInformationAndSeo();
            this.pageComponent = mapContentTypePageToComponent(this.contentType);
            this.setPageComponentInputs();
          })
      });
  }

  private async getEntriesForPage(slug: string): Promise<void> {
    if (this.mock) {
      this.processEntriesForPage(pageMock);
      return;
    }
    await contentfulClient.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      include: 6
    }).then(response => {
      this.processEntriesForPage(response);
    })
  }

  private processEntriesForPage(serviceReponse: any) {
    const pageObject = serviceReponse?.items[0];
    console.info("Page", pageObject);
    //if page not able to be fetched -> probably 404 error
    if (!pageObject) {
      console.error('Error 404: Page could not be found.')
      /* ctx.error({ message: 'Error 404', statusCode: 404 });
      return; */
    }
    this.pageObject = pageObject;
    this.pageContent = pageObject?.fields ? pageObject.fields['content'] as CfPage : {};
    this.contentType = getContentTypeFromEntry(this.pageContent);
    console.info("contentType", this.contentType);
  }

  private async getStandardPageConfig(): Promise<void> {
    if (this.mock) {
      this.processStandardPageConfig(standardPageConfigMock);
      return;
    }
    await contentfulClient.getEntries({
      content_type: 'standardPageConfig',
      include: 6
    }).then(response => {
      this.processStandardPageConfig(response);
    })
  }

  private processStandardPageConfig(serviceResponse: any) {
    this.standardPageConfig = serviceResponse?.items[0] as CfStandardPageConfig;
    console.info("Standard Page Config", this.standardPageConfig);
  }

  setPageComponentInputs(): void {
    this.pageComponentInputs = {
      "pageContent": this.pageContent,
      "fullPath": this.fullPath,
      "standardPageConfig": this.standardPageConfig
    }
  }

  setPageInformationAndSeo() {
    const pageTitle = this.pageObject?.fields?.pageTitle;
    const pageTitleComplete = pageTitle ? `${pageTitle} | ${environment?.organizationName}` : environment?.organizationName;
    this.titleTagService.setTitle(pageTitleComplete);

    this.setOpenGraphTags(pageTitleComplete);

  }

  setOpenGraphTags(pageTitle: string) {
    const ogDescription = this.pageObject?.fields?.openGraphDescription ?
      this.pageObject.fields.openGraphDescription : this.standardPageConfig?.fields?.openGraphStandardDescription;
    const ogImage = this.pageObject?.fields?.openGraphImage ?
      this.pageObject.fields.openGraphImage : this.standardPageConfig?.fields?.openGraphStandardImage;

    let ogTags: MetaDefinition[] = [
      //these tags are always available
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: environment?.organizationName },
      {
        property: 'og:url',
        content: `${environment.baseUrl}${this.fullPath}/`
      }
    ];

    //these tags may or may not be added, even though that might cause og tags not to be complete
    if (pageTitle) ogTags.push({ property: 'og:title', content: pageTitle });
    if (ogDescription) {
      ogTags.push({ property: 'og:description', content: ogDescription });
      ogTags.push({ name: 'description', content: ogDescription });
    }
    if (ogImage?.fields?.file?.url) {
      ogTags.push({
        property: 'og:image',
        content: 'https:' + ogImage.fields.file.url
      });
    }

    this.metaTagService.addTags(ogTags);
  }

  stringify(obj: any) {
    return JSON.stringify(obj, this.getCircularReplacer(), 2);
  }

  private getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key: any, value: any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  }
}
