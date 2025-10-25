import { NgComponentOutlet } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, computed, DOCUMENT, effect, ElementRef, inject, Inject, Type, viewChild } from '@angular/core';
import { CfPage } from '../../models/contentful-content-types/page';
import { CfStandardPageConfig } from '../../models/contentful-content-types/standard-page-config';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { debounceTime, filter } from 'rxjs';
import { pageMock, standardPageConfigMock } from '../../components/shared/mock';
import { getContentTypeFromEntry, getImageUrl } from '../../components/shared/utils';
import { mapContentTypePageToComponent } from '../../components/shared/mapping';
import { contentfulClient } from '../../components/shared/contentful';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { Asset, AssetDetails } from 'contentful';
import { LinkService } from '../../components/shared/LinkService';
import { ScriptService } from '../../components/shared/ScriptService';

@Component({
  selector: 'app-dynamic-page',
  imports: [NgComponentOutlet],
  providers: [LinkService, ScriptService],
  template: '<div #dummy></div><ng-container *ngComponentOutlet="pageComponent(); inputs: pageComponentInputs()" />',
})
export class DynamicPage implements AfterContentInit {
  mock = false;
  // contentType = "";
  // fullPath = "";
  // pageObject: any;
  // pageContent: CfPage;
  // standardPageConfig: CfStandardPageConfig;
  // pageComponent: Type<any>;
  // pageComponentInputs: Record<string, unknown>;

  private route = inject(ActivatedRoute);

  private pageObject = computed(() => this.route.snapshot.data['pageObject']);
  private standardPageConfig = computed<CfStandardPageConfig>(() => this.route.snapshot.data['standardPageConfig']);
  private pageTitle = computed(() => this.pageObject()?.fields?.pageTitle);
  pageContent = computed<CfPage>(() => this.pageObject()?.fields ? this.pageObject().fields['content'] as CfPage : {});
  contentType = computed<any>(() => getContentTypeFromEntry(this.pageContent()));
  fullPath = computed<string>(() => {
    return '/' + this.route.snapshot.url.flatMap(urlSegment => urlSegment.path).join('/');
  });
  pageComponent = computed<Type<any>>(() => mapContentTypePageToComponent(this.contentType()));
  pageComponentInputs = computed<Record<string, unknown>>(() => ({
    "pageContent": this.pageContent(),
    "fullPath": this.fullPath(),
    "standardPageConfig": this.standardPageConfig()
  }));
  document = inject(DOCUMENT);
  metaTagService = inject(Meta)
  linkService = inject(LinkService);
  scriptService = inject(ScriptService);
  dummy = viewChild<ElementRef>('dummy');

  constructor() {
    // console.log("HIER PAGEOBJECT!", this.route.snapshot.url);

    // this.loadInformationByRoute();
    // this.document.addEventListener('DOMContentLoaded', this.setPageInformationAndSeo)
    effect(() => {
      this.setPageInformationAndSeo();
    });
  }

  ngAfterContentInit(): void {

  }

  /*private loadInformationByRoute() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        debounceTime(200)
      )
      .subscribe((event: NavigationEnd) => {
        const route = event.url === "/" || event.url === "/index" ? "/home" : event.url;
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
  }*/

  /*private async getEntriesForPage(slug: string): Promise<void> {
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
  }*/

  /*private processEntriesForPage(serviceReponse: any) {
    const pageObject = serviceReponse?.items[0];
    //console.info("Page", pageObject);
    //if page not able to be fetched -> probably 404 error
    if (!pageObject) {
      console.error('Error 404: Page could not be found.')
      // ctx.error({ message: 'Error 404', statusCode: 404 });
      // return;
    }
    this.pageObject = pageObject;
    // this.pageContent = pageObject?.fields ? pageObject.fields['content'] as CfPage : {};
    this.contentType = getContentTypeFromEntry(this.pageContent);
    //console.info("contentType", this.contentType);
  }*/

  /* private async getStandardPageConfig(): Promise<void> {
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
    //console.info("Standard Page Config", this.standardPageConfig);
  }*/

  /* setPageComponentInputs(): void {
    this.pageComponentInputs = {
      "pageContent": this.pageContent,
      "fullPath": this.fullPath,
      "standardPageConfig": this.standardPageConfig
    }
  } */

  setPageInformationAndSeo() {
    const pageTitle = this.pageObject()?.fields?.pageTitle;
    const ogDescription = this.pageObject()?.fields?.openGraphDescription ?
      this.pageObject().fields.openGraphDescription : this.standardPageConfig()?.fields?.openGraphStandardDescription;
    const ogImage: Asset = this.pageObject()?.fields?.openGraphImage ?
      this.pageObject().fields.openGraphImage : this.standardPageConfig()?.fields?.openGraphStandardImage;
    const ogImageUrl = ogImage?.fields?.file?.url?.toString();
    const pageTitleComplete = pageTitle ? `${pageTitle} | ${environment?.organizationName}` : environment?.organizationName;
    // this.titleTagService.setTitle(pageTitleComplete);

    this.setOpenGraphTags(ogDescription, pageTitleComplete, ogImageUrl);
    this.setLinkTag(`${environment.baseUrl}${this.fullPath()}/`, "canonical", undefined);
    //this.setLinkTag(ogImageUrl, undefined, "image");
    this.setJsonLd(ogDescription, ogImage);
  }

  setOpenGraphTags(ogDescription: string, pageTitle: string, ogImageUrl: string) {

    let ogTags: MetaDefinition[] = [
      //these tags are always available
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: environment?.organizationName },
      {
        property: 'og:url',
        content: `${environment.baseUrl}${this.fullPath()}/`
      }
    ];

    //these tags may or may not be added, even though that might cause og tags not to be complete
    if (pageTitle) ogTags.push({ property: 'og:title', content: pageTitle });
    if (ogDescription) {
      ogTags.push({ property: 'og:description', content: ogDescription });
      ogTags.push({ name: 'description', content: ogDescription });
    }
    if (ogImageUrl) {
      ogTags.push({
        property: 'og:image',
        content: 'https:' + ogImageUrl
      });
    }

    this.metaTagService.addTags(ogTags);
  }

  setLinkTag(href: string, rel: string, itemprop: string) {
    const linkTag = this.document.createElement('link');
    if (rel) {
      linkTag.setAttribute('rel', rel);
    }
    if (itemprop) {
      linkTag.setAttribute('itemprop', itemprop);
    }
    linkTag.setAttribute('href', href);
    //todo does not work
    // this.document.head.append(linkTag);
    this.linkService.addTag({
      rel: rel,
      href: href
    });
    // console.log("dummy", this.dummy()?.nativeElement.ownerDocument.head.append(linkTag));
    // this.dummy()?.nativeElement.ownerDocument.head.append(linkTag);
  }

  setJsonLd(ogDescription: string, ogImage: Asset) {
    const ogImageDetails: AssetDetails = ogImage?.fields?.file?.details as AssetDetails;
    const innerHtml = `{
        "@context": "https://schema.org/",
        "@type": "WebSite",
        "name": ${environment.organizationName},
        "alternateName": ${environment.alternativeName},
        "url": ${environment.baseUrl},
        "description": "${ogDescription}",
        "image": {
          "@type": "ImageObject",
          "url": "${getImageUrl(ogImage) ? 'https:' + getImageUrl(ogImage) : ''}",
          "width": "${ogImageDetails?.image?.width ? ogImageDetails.image.width : ''}",
          "height": "${ogImageDetails?.image?.height ? ogImageDetails.image.height : ''}"
        },
        "author": {
          "@type": "Organization",
          "name": ${environment.organizationName},
          "url": ${environment.baseUrl}
        }
      }`;
    // const scriptTag = this.document.createElement('script');
    // scriptTag.setAttribute("type", "application/ld+json");
    // scriptTag.innerHTML = innerHtml;
    //todo does not work
    // this.document.head.append(scriptTag);
    this.scriptService.addTag("application/ld+json", innerHtml);
    // this.dummy()?.nativeElement.ownerDocument.head.append(scriptTag);
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
