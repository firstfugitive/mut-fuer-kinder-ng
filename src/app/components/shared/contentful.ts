import { ImageLoaderConfig } from "@angular/common";
import { ContentfulClientApi, createClient } from "contentful";

export const contentfulClient: ContentfulClientApi<undefined> = createClient({
    space: 'dbcppdxw8bib',//this.contentfulConfiguration.spaceId,
    accessToken: 'XIOUq8XaCeuhXgblbO1DA2mgHX-uo1bAseK-FZ6jqJQ',//this.contentfulConfiguration.accessToken,
    host: 'cdn.contentful.com',//this.contentfulConfiguration.environment,
    environment: 'master',
    //resolveLinks: true,
});

export const imageLoaderConfigContentful = (config: ImageLoaderConfig) => {
    const queryParams = [];
    if (config.loaderParams) {
        if (config.loaderParams['height'] && config.width) {
            const width = config.loaderParams['width'] || config.width;
            const ratio = config.width / width;
            const height = Math.round(config.loaderParams['height'] * ratio);
            queryParams.push(`h=${height}`);
        }
        if (config.width && config.loaderParams['fillWithFaceFocus']) {
            queryParams.push('fit=fill&f=faces');
        }
    }
    if (config.width) {
        queryParams.push(`w=${config.width}`);
    }
    return `${config.src}?fm=webp&${queryParams.join('&')}`;
}

