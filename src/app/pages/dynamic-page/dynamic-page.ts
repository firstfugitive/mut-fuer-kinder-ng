import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DOCUMENT, Inject, Type, ViewContainerRef } from '@angular/core';
import { ContentfulClientApi, createClient, Entry, EntryCollection, EntrySkeletonType } from 'contentful';
import { stringify } from 'querystring';
import { PageContentBlog } from '../page-content-blog/page-content-blog';
import { CfPage } from '../../models/contentful-content-types/page';
import { CfStandardPageConfig } from '../../models/contentful-content-types/standard-page-config';

@Component({
  selector: 'app-dynamic-page',
  imports: [NgComponentOutlet],
  templateUrl: './dynamic-page.html',
  styleUrl: './dynamic-page.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DynamicPage {
  contentType = "";
  fullPath = "";
  pageContent: CfPage;
  standardPageConfig: CfStandardPageConfig;
  
  private contentfulClient: ContentfulClientApi<undefined>  = createClient({
      space: 'dbcppdxw8bib',//this.contentfulConfiguration.spaceId,
      accessToken: 'XIOUq8XaCeuhXgblbO1DA2mgHX-uo1bAseK-FZ6jqJQ',//this.contentfulConfiguration.accessToken,
      host: 'cdn.contentful.com',//this.contentfulConfiguration.environment,
      environment: 'master',
      //resolveLinks: true,
    });

  constructor(@Inject(DOCUMENT) private document: Document) {
    const route = this.document.location.pathname;

    const pathParts = route.split('/').filter(e => e !== '');
    let slug = pathParts.reverse()[0];
    //const urlSubfolder = route.substr(0, route.lastIndexOf(slug));
    const urlSubfolderNew = route.substring(0, route.lastIndexOf(slug));
    slug = slug || 'index';

    console.info('ROUTE', route);
    //console.info('NAME', ctx.route.name);
    //console.info('URL-SUBFOLDER', urlSubfolder);
    console.info('URL-SUBFOLDER new', urlSubfolderNew);
    console.info('SLUG', slug);

    this.fullPath = `${urlSubfolderNew}${slug}`;

    this.getEntriesForPage(slug);
    this.getStandardPageConfig();
  }

  private getEntriesForPage(slug: string): void {
    this.contentfulClient.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      include: 6
    }).then(response => {
      const pageObject = response?.items[0];
      console.info("Page", pageObject);
      //if page not able to be fetched -> probably 404 error
      if (!pageObject) {
        console.error('Error 404: Page could not be found.')
        /* ctx.error({ message: 'Error 404', statusCode: 404 });
        return; */
      }
      this.pageContent = pageObject?.fields ? pageObject.fields['content'] as CfPage : {};
      this.contentType = this.pageContent?.sys?.contentType?.sys?.id;
      console.info("contentType", this.contentType);
    })
  }

  private getStandardPageConfig(): void {
    this.contentfulClient.getEntries({
      content_type: 'standardPageConfig',
      include: 6
    }).then(response => {
      this.standardPageConfig = response?.items[0] as CfStandardPageConfig;
      console.info("Standard Page Config", this.standardPageConfig);
    })
  }

  getPageComponent(): Type<any> {
    return PageContentBlog;
  }

  getPageComponentInputs(): Record<string, unknown> {
    console.log("standardPageConfig footer", this.standardPageConfig?.fields?.footer)
    return {
      "data": this.pageContent,
      "fullPath": this.fullPath,
      "standardPageConfig": this.standardPageConfig
    }
  }

  /* stringify(obj: any) {
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
  } */
}
