import { NgComponentOutlet } from '@angular/common';
import { Component, computed, effect, inject, Type } from '@angular/core';
import { CfPage } from '../../models/contentful-content-types/page';
import { CfStandardPageConfig } from '../../models/contentful-content-types/standard-page-config';
import { ActivatedRoute } from '@angular/router';
import { getContentTypeFromEntry, getImageUrl } from '../../components/shared/utils';
import { mapContentTypePageToComponent } from '../../components/shared/mapping';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { Asset, AssetDetails } from 'contentful';
import { TagService } from '../../components/shared/TagService';

@Component({
  selector: 'app-dynamic-page',
  imports: [NgComponentOutlet],
  providers: [TagService],
  template: '<ng-container *ngComponentOutlet="pageComponent(); inputs: pageComponentInputs()" />',
})
export class DynamicPage {
  private route = inject(ActivatedRoute);
  metaTagService = inject(Meta);
  tagService = inject(TagService);

  private pageObject = computed(() => this.route.snapshot.data['pageObject']);
  private standardPageConfig = computed<CfStandardPageConfig>(() => this.route.snapshot.data['standardPageConfig']);
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

  constructor() {
    effect(() => {
      this.setPageInformationAndSeo();
    });
  }

  setPageInformationAndSeo() {
    const pageTitle = this.pageObject()?.fields?.pageTitle;
    const ogDescription = this.pageObject()?.fields?.openGraphDescription ?
      this.pageObject().fields.openGraphDescription : this.standardPageConfig()?.fields?.openGraphStandardDescription;
    const ogImage: Asset = this.pageObject()?.fields?.openGraphImage ?
      this.pageObject().fields.openGraphImage : this.standardPageConfig()?.fields?.openGraphStandardImage;
    const ogImageUrl = this.contentfulSmallImgLink(ogImage);
    const pageTitleComplete = pageTitle ? `${pageTitle} | ${environment?.organizationName}` : environment?.organizationName;

    this.setOpenGraphTags(ogDescription, pageTitleComplete, ogImageUrl);
    
    this.tagService.addLinkTag(`${environment.baseUrl}${this.fullPath()}`, "canonical", undefined);
    this.tagService.addLinkTag(ogImageUrl, undefined, "image");
    this.setJsonLd(ogDescription, ogImage);
  }

  setOpenGraphTags(ogDescription: string, pageTitle: string, ogImageUrl: string) {

    let ogTags: MetaDefinition[] = [
      //these tags are always available
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: environment?.organizationName },
      {
        property: 'og:url',
        content: `${environment.baseUrl}${this.fullPath()}`
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
    ogTags.push({
      property: 'og:logo',
      content: '/icon-192.png',
      size: '192x192'
    });
    ogTags.push({
      property: 'og:logo',
      content: '/icon-512.png',
      size: '512x512'
    });

    this.metaTagService.addTags(ogTags);
  }

  setJsonLd(ogDescription: string, ogImage: Asset) {
    const innerHtml = `{
        "@context": "https://schema.org/",
        "@type": "WebSite",
        "name": "${environment.organizationName}",
        "alternateName": "${environment.alternativeName}",
        "url": "${environment.baseUrl}",
        "description": "${ogDescription}",
        "image": {
          "@type": "ImageObject",
          "url": "${this.contentfulSmallImgLink(ogImage) ? 'https:' + this.contentfulSmallImgLink(ogImage) : ''}",
          "width": "700",
          "height": "394"
        },
        "author": {
          "@type": "Organization",
          "name": "${environment.organizationName}",
          "url": "${environment.baseUrl}"
        }
      }`;
    this.tagService.addScriptTag("application/ld+json", innerHtml);
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

  private contentfulSmallImgLink(image: Asset): string {
    return `${getImageUrl(image)}?w=700&fm=webp`;
  }
}
