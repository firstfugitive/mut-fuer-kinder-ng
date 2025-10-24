import { Routes } from '@angular/router';
import { DynamicPage } from './pages/dynamic-page/dynamic-page';
import { environment } from '../environments/environment';
import { contentfulClient } from './components/shared/contentful';

export const routes: Routes = [
    // {
    //     path: 'home',
    //     component: DynamicPage,
    //     title: environment?.organizationName,
    // },
    // {
    //     path: 'kontakt-und-spenden',
    //     component: DynamicPage,
    //     title: environment?.organizationName,
    // },
    // {
    //     path: '',
    //     component: DynamicPage,
    //     title: environment?.organizationName,
    // },
    {
        path: '',
        component: DynamicPage,
        title: environment?.organizationName,
        loadChildren: generatePaths
    },
];


const PAGES = {
  'content_type': 'page',
  'limit': 1000,
};

export function generatePaths() {
  const routes: Promise<string[]> = contentfulClient.getEntries(PAGES)
    .then(extractPages)
    .then(transformPagesToPaths)
    .then(filterIndexPaths)
    .then(logPaths)
    .catch(handleError);
  console.log("test", routes)
  return routes.then(arr => arr.map(route => ({
    path: route,
    component: DynamicPage,
    title: environment?.organizationName,
  })));
}


function generatePathsSitemap() {
  return contentfulClient.getEntries(PAGES)
    .then(extractPages)
    .then(transformPagesToPathsSitemap)
    //.then(filterIndexPathsSitemap)
    .then(logPaths)
    .catch(handleError);
}

async function filterIndexPaths(pages) {
  return pages.map(e => e.replace('index/', ''));
}
async function filterIndexPathsSitemap(pages) {
  return pages.map(e => e.url?.replace('index/', ''));
}

async function extractPages(response) {
  return response.items;
}

async function transformPagesToPaths(pages) {
  return pages.flatMap(transformPageToPath);
}

async function transformPagesToPathsSitemap(pages) {
  return pages.flatMap(transformPageToPathSitemap);
}

async function logPaths(paths) {
  console.dir(paths, { maxArrayLength: 1000 })
  console.log('Sites to be generated:', paths.length)
  return paths;
}

function transformPageToPath(page) {
  return `${page?.fields?.urlSubfolder?.fields?.path.substring(1)}${page?.fields?.slug}`;
}

function transformPageToPathSitemap(page) {

  return {
    url: `${page?.fields?.urlSubfolder?.fields?.path}${page?.fields?.slug}/`,
    lastmod: `${page?.sys?.updatedAt ? page?.sys?.updatedAt : ''}`
  }
}

function prefixFromLanguage(language) {
  return language !== 'en' ? `/${language}` : '';
}

function handleError(error) {
  console.error(error);
  return ['/'];
}

