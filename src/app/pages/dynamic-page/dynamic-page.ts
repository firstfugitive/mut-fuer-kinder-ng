import { AsyncPipe } from '@angular/common';
import { Component, DOCUMENT, Inject } from '@angular/core';
import { ContentfulClientApi, createClient, EntryCollection, EntrySkeletonType } from 'contentful';

@Component({
  selector: 'app-dynamic-page',
  imports: [AsyncPipe],
  templateUrl: './dynamic-page.html',
  styleUrl: './dynamic-page.scss'
})
export class DynamicPage {
pageEntries: Promise<string | EntryCollection<EntrySkeletonType, undefined, string>>;
  standardPageConfig: Promise<string | EntryCollection<EntrySkeletonType, undefined, string>>;
  
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
    let urlSubfolder = route.substr(0, route.lastIndexOf(slug));
    slug = slug || 'index';

      console.info('ROUTE', route);
      //console.info('NAME', ctx.route.name);
      console.info('URL-SUBFOLDER', urlSubfolder);
      console.info('SLUG', slug);

    this.pageEntries = this.getEntriesForPage();
    this.standardPageConfig = this.getStandardPageConfig();
  }

  private getEntriesForPage() {
    return this.contentfulClient.getEntries({
      content_type: 'page',
      'fields.slug': 'home',//slug,
      include: 6
    }).then(response => {
      console.log("Page", response)
      const stringified = JSON.stringify(response, this.getCircularReplacer(), 2)
      return stringified;
    })
  }

  private getStandardPageConfig() {
    return this.contentfulClient.getEntries({
      content_type: 'standardPageConfig',
      include: 6
    }).then(response => {
      console.log("Standard Page Config", response);
      const stringified = JSON.stringify(response, this.getCircularReplacer(), 2)
      return stringified;
    })
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
