import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { Component, DOCUMENT, Inject, Type, ViewContainerRef } from '@angular/core';
import { ContentfulClientApi, createClient, Entry, EntryCollection, EntrySkeletonType } from 'contentful';
import { stringify } from 'querystring';
import { PageContentBlog } from '../page-content-blog/page-content-blog';

@Component({
  selector: 'app-dynamic-page',
  imports: [NgComponentOutlet],
  templateUrl: './dynamic-page.html',
  styleUrl: './dynamic-page.scss'
})
export class DynamicPage {
  pageEntries: Promise<Entry<EntrySkeletonType, undefined, string>>;
  contentType = "";
  pageContent: any;
  fullPath = "";

  standardPageConfig: Promise<Entry<EntrySkeletonType, undefined, string>>;
  
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

    this.pageEntries = this.getEntriesForPage(slug);

    this.standardPageConfig = this.getStandardPageConfig();
  }

  private getEntriesForPage(slug: string): Promise<Entry<EntrySkeletonType, undefined, string>> {
    return this.contentfulClient.getEntries({
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
      this.pageContent = pageObject?.fields ? pageObject.fields['content'] : {};
      this.contentType = this.pageContent?.sys?.contentType?.sys?.id;
      console.info("contentType", this.contentType)
      return pageObject;
    })
  }

  private getStandardPageConfig(): Promise<Entry<EntrySkeletonType, undefined, string>> {
    return this.contentfulClient.getEntries({
      content_type: 'standardPageConfig',
      include: 6
    }).then(response => {
      const standardPageConfigObject = response?.items[0];
      console.info("Standard Page Config", standardPageConfigObject);
      return standardPageConfigObject;
    })
  }

  getPageComponent(): Type<any> {
    return PageContentBlog;
  }

  getPageComponentInputs(): Record<string, unknown> {
    return {
      "data": this.pageContent,
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
