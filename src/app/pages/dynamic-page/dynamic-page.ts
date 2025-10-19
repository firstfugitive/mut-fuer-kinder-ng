import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Type } from '@angular/core';
import { ContentfulClientApi, createClient } from 'contentful';
import { PageContentBlog } from '../page-content-blog/page-content-blog';
import { CfPage } from '../../models/contentful-content-types/page';
import { CfStandardPageConfig } from '../../models/contentful-content-types/standard-page-config';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, filter } from 'rxjs';
import { PageContentHome } from '../page-content-home/page-content-home';
import { pageMock, standardPageConfigMock } from '../../components/shared/mock';
import { getContentTypeFromEntry } from '../../components/shared/utils';
import { mapContentTypePageToComponent } from '../../components/shared/mapping';

@Component({
  selector: 'app-dynamic-page',
  imports: [NgComponentOutlet],
  templateUrl: './dynamic-page.html',
  styleUrl: './dynamic-page.scss'
})
export class DynamicPage {
  mock = false;
  contentType = "";
  fullPath = "";
  pageContent: CfPage;
  standardPageConfig: CfStandardPageConfig;
  pageComponent: Type<any>;
  pageComponentInputs: Record<string, unknown>;

  private contentfulClient: ContentfulClientApi<undefined> = createClient({
    space: 'dbcppdxw8bib',//this.contentfulConfiguration.spaceId,
    accessToken: 'XIOUq8XaCeuhXgblbO1DA2mgHX-uo1bAseK-FZ6jqJQ',//this.contentfulConfiguration.accessToken,
    host: 'cdn.contentful.com',//this.contentfulConfiguration.environment,
    environment: 'master',
    //resolveLinks: true,
  });

  constructor(private router: Router) {
    this.loadInformationByRoute();
  }

  private loadInformationByRoute() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        debounceTime(200)
      )
      .subscribe((event: NavigationEnd) => {
        const route = event.url;//router.url;
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
    await this.contentfulClient.getEntries({
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
    this.pageContent = pageObject?.fields ? pageObject.fields['content'] as CfPage : {};
    this.contentType = getContentTypeFromEntry(this.pageContent);
    console.info("contentType", this.contentType);
  }

  private async getStandardPageConfig(): Promise<void> {
    if(this.mock) {
      this.processStandardPageConfig(standardPageConfigMock);
      return;
    }
    await this.contentfulClient.getEntries({
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
