import { Entry, EntrySkeletonType } from "contentful";
import { environment } from "../../../environments/environment";
import { DynamicPage } from "../../pages/dynamic-page/dynamic-page";
import { contentfulClient } from "./contentful";
import { CfStandardPageConfig } from "../../models/contentful-content-types/standard-page-config";

export const PAGES = {
    'content_type': 'page',
    'limit': 1000,
    include: 6
};

interface RouteTitle {
    route: string,
    title: string,
    pageObject: any
}

export async function generatePaths() {
    console.log("generate paths");
    const entries: RouteTitle[] = await contentfulClient.getEntries(PAGES)
        .then(response => response.items)
        .then(transformPagesToPaths)
        .then(filterIndexPaths)
        .then(logPaths)
        .catch(handleError);
    const standardPageConfig = await contentfulClient.getEntries({
        content_type: 'standardPageConfig',
        include: 6
    }).then(response => response?.items[0] as CfStandardPageConfig)
    const routes = entries.map(entry => ({
        path: entry?.route,
        component: DynamicPage,
        title: entry?.title,
        data: { pageObject: entry?.pageObject, standardPageConfig: standardPageConfig }
    }));
    return routes;
}

function transformPagesToPaths(pages: Entry<EntrySkeletonType, undefined, string>[]): RouteTitle[] {
    return pages.flatMap(transformPageToPath);
}

function transformPageToPath(page): RouteTitle {
    const pageTitle = page?.fields?.pageTitle;
    const pageTitleComplete = pageTitle ? `${pageTitle} | ${environment?.organizationName}` : environment?.organizationName;
    let path = page?.fields?.urlSubfolder?.fields?.path.substring(1);
    let slug = page?.fields?.slug;
    //transform '/index'
    // if(slug === "index") {
    //     path = '';
    //     slug = '';
    // }
    return {
        route: `${path}${slug}`,
        title: pageTitleComplete,
        pageObject: page
    };
}

function filterIndexPaths(pages: RouteTitle[]): RouteTitle[] {
    return pages.filter(entry => entry.route !== 'index');
}

function logPaths(paths: RouteTitle[]): RouteTitle[] {
    // console.dir(paths, { maxArrayLength: 1000 })
    console.log('Sites to be generated:', paths.length)
    return paths;
}

function handleError(error) {
    console.error(error);
    return [{
        route: '/',
        title: environment.organizationName,
        pageObject: undefined
    }];
}

