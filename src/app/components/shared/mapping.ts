import { Type } from "@angular/core";
import { MarkdownText } from "../molecule/markdown-text/markdown-text";
import { TextModule } from "../organism/text-module/text-module";
import { FeaturedPage } from "../molecule/featured-page/featured-page";

const contentTypeMap = {
    "textModule": TextModule,
    "markdownText": MarkdownText,
    "featuredPage": FeaturedPage
}

export const mapContentTypeToComponent = (contentType: string): Type<void> => {
    return contentTypeMap[contentType];
}