import { ImageLoaderConfig } from "@angular/common";
import { ContentfulClientApi, createClient } from "contentful";
import { environment } from "../../../environments/environment";

export const contentfulClient: ContentfulClientApi<undefined> = createClient({
    space: 'dbcppdxw8bib',
    accessToken: environment.production ? 'XIOUq8XaCeuhXgblbO1DA2mgHX-uo1bAseK-FZ6jqJQ' : 'uR_RGqNf--03pw4258mhYMmP2U1-XFHpKCdv8_yvnbM',
    host: environment.production ? 'cdn.contentful.com' : 'preview.contentful.com',
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

