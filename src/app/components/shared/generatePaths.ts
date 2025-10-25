import { Entry, EntrySkeletonType } from "contentful";
import { environment } from "../../../environments/environment";
import { DynamicPage } from "../../pages/dynamic-page/dynamic-page";
import { contentfulClient } from "./contentful";

export const PAGES = {
    'content_type': 'page',
    'limit': 1000,
};

interface RouteTitle {
    route: string,
    title: string
}

export function generatePaths() {
    const entries: Promise<RouteTitle[]> = contentfulClient.getEntries(PAGES)
        .then(response => response.items)
        .then(transformPagesToPaths)
        .then(filterIndexPaths)
        .then(logPaths)
        .catch(handleError);
    const routes = entries.then(arr => arr.map(entry => ({
            path: entry?.route,
            component: DynamicPage,
            title: entry?.title,
        })));
    return routes;
}

function transformPagesToPaths(pages: Entry<EntrySkeletonType, undefined, string>[]): RouteTitle[] {
    return pages.flatMap(transformPageToPath);
}

function transformPageToPath(page): RouteTitle {
    const pageTitle = page?.fields?.pageTitle;
    const pageTitleComplete = pageTitle ? `${pageTitle} | ${environment?.organizationName}` : environment?.organizationName;
    return {
        route: `${page?.fields?.urlSubfolder?.fields?.path.substring(1)}${page?.fields?.slug}`,
        title: pageTitleComplete
    };
}

function filterIndexPaths(pages: RouteTitle[]): RouteTitle[] {    
    return pages.filter(entry => entry.route !== 'index');
}

function logPaths(paths: RouteTitle[]): RouteTitle[] {
    // console.dir(paths, { maxArrayLength: 1000 })
    // console.log('Sites to be generated:', paths.length)
    return paths;
}

function handleError(error) {
    console.error(error);
    return [{
        route: '/',
        title: environment.organizationName
    }];
}

