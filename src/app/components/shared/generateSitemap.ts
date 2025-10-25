import { writeFileSync } from "node:fs";
import { contentfulClient } from "./contentful";
import { CfPage } from "../../models/contentful-content-types/page";
import { environment } from "../../../environments/environment";


const PAGES = {
    'content_type': 'page',
    'limit': 1000,
};

generatePathsSitemap().then(resp => generateSitemapXml(resp));

function generateSitemapXml(entries: SitemapEntry[]) {
    const startOfXml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">';
    const endOfXml = '</urlset>';
    let fileData = startOfXml;
    entries.forEach(entry => fileData = fileData.concat(`<url><loc>${entry.url}</loc><lastmod>${entry.lastmod}</lastmod></url>`));
    fileData = fileData.concat(endOfXml);
    writeFileSync('./public/sitemap.xml', fileData);
}

interface SitemapEntry {
    url: string,
    lastmod: string
}

function generatePathsSitemap() {
    return contentfulClient.getEntries(PAGES)
        .then(response => response.items as CfPage[])
        .then(transformPagesToPathsSitemap)
        .then(sortByDate)
        .then(logPaths)
        .catch(handleError);
}

function transformPagesToPathsSitemap(pages: CfPage[]): SitemapEntry[] {
    return pages.flatMap(transformPageToPathSitemap);
}

function transformPageToPathSitemap(page: CfPage): SitemapEntry {
    let path = page?.fields?.urlSubfolder?.fields?.path;
    let slug = page?.fields?.slug;
    //transform '/index'
    if(slug === "index") {
        path = '';
        slug = '';
    }
    return {
        url: `${environment.baseUrl}${path}${slug}/`,
        lastmod: `${page?.sys?.updatedAt ? page?.sys?.updatedAt : ''}`
    }
}

function sortByDate(entries: SitemapEntry[]): SitemapEntry[] {
    return entries.sort((a: SitemapEntry, b: SitemapEntry) => Date.parse(a.lastmod) <  Date.parse(b.lastmod) ? 1 : -1);
}

function logPaths(paths: SitemapEntry[]): SitemapEntry[] {
    console.dir(paths, { maxArrayLength: 1000 })
    console.log('Sites to be generated:', paths.length)
    return paths;
}
function handleError(error): SitemapEntry[] {
    console.error(error);
    return [{
        url: '/',
        lastmod: ''
    }];
}