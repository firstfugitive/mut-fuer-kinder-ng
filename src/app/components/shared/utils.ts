import { Asset, Entry } from "contentful";
import { CfPage } from "../../models/contentful-content-types/page";
import { TextModule } from "../organism/text-module/text-module";
import { Type } from "@angular/core";
import { MarkdownText } from "../molecule/markdown-text/markdown-text";

export const getUrlFromPage = (page: CfPage) => {
  if(page?.fields?.urlSubfolder?.fields?.path && page?.fields?.slug) {
    return `${page.fields.urlSubfolder.fields.path}${page.fields.slug}`;
  } else {
    return undefined;
  }
}

export const getContentTypeFromEntry = (entry: Entry | CfPage | any) => {
  return entry?.sys?.contentType?.sys?.id;
}

export const getImageUrl = (image: Asset): string => {
  return image?.fields?.file?.url?.toString();
}

export const formatDate = (rawDate: string) => {
  if (!rawDate) {
    return undefined;
  }
  const date = new Date(rawDate);
  return date.toLocaleString('de', { year: 'numeric', month: 'long', day: 'numeric' });
}
