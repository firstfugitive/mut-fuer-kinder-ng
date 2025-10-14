import { CfPage } from "../../models/contentful-content-types/page";

export const getUrlFromPage = (page: CfPage) => {
  if(page?.fields?.urlSubfolder?.fields?.path && page?.fields?.slug) {
    return `${page.fields.urlSubfolder.fields.path}${page.fields.slug}`;
  } else {
    return undefined;
  }
}

export const formatDate = (rawDate: any) => {
  if (!rawDate) {
    return undefined;
  }
  const date = new Date(rawDate);
  return date.toLocaleString('de', { year: 'numeric', month: 'long', day: 'numeric' });
}
