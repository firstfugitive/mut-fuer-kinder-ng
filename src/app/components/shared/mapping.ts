import { Type } from "@angular/core";
import { MarkdownText } from "../molecule/markdown-text/markdown-text";
import { TextModule } from "../organism/text-module/text-module";
import { FeaturedPage } from "../molecule/featured-page/featured-page";
import { ImageHalfSize } from "../molecule/image-half-size/image-half-size";
import { ButtonModule } from "../molecule/button-module/button-module";
import { PageContentBlog } from "../../pages/page-content-blog/page-content-blog";
import { PageContentHome } from "../../pages/page-content-home/page-content-home";
import { PageContentStandard } from "../../pages/page-content-standard/page-content-standard";

const contentTypeEntryMap = {
    "textModule": TextModule,
    "markdownText": MarkdownText,
    "featuredPage": FeaturedPage,
    "imageHalfSize": ImageHalfSize,
    "buttonModule": ButtonModule
};

const contentTypePageMap = {
    "pageContentBlog": PageContentBlog,
    "pageContentHome": PageContentHome,
    "pageContentStandard": PageContentStandard
};

export const mapContentTypeToComponent = (contentType: string): Type<void> => {
    return contentTypeEntryMap[contentType];
}

export const mapContentTypePageToComponent = (contentType: string): Type<void> => {
    return contentTypePageMap[contentType];
}
