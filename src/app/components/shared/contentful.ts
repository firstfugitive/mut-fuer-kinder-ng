import { ContentfulClientApi, createClient } from "contentful";

export const contentfulClient: ContentfulClientApi<undefined> = createClient({
    space: 'dbcppdxw8bib',//this.contentfulConfiguration.spaceId,
    accessToken: 'XIOUq8XaCeuhXgblbO1DA2mgHX-uo1bAseK-FZ6jqJQ',//this.contentfulConfiguration.accessToken,
    host: 'cdn.contentful.com',//this.contentfulConfiguration.environment,
    environment: 'master',
    //resolveLinks: true,
});
