import { Entry } from "contentful";
import { CfPage } from "../../models/contentful-content-types/page";
import { TextModule } from "../organism/text-module/text-module";
import { Type } from "@angular/core";

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

export const mapContentTypeToComponent = (contentType: string): Type<void> => {
  switch(contentType) {
    case "textModule":
      return TextModule;
    default:
      return TextModule;
  }
}

export const formatDate = (rawDate: any) => {
  if (!rawDate) {
    return undefined;
  }
  const date = new Date(rawDate);
  return date.toLocaleString('de', { year: 'numeric', month: 'long', day: 'numeric' });
}
