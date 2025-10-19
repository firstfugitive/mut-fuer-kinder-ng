import { ChangeDetectionStrategy, Component, computed, input, Type } from "@angular/core";
import { CfStandardPageConfig } from "../models/contentful-content-types/standard-page-config";
import { CfPageHeader } from "../models/contentful-content-types/page-header";
import { CfPageFooter } from "../models/contentful-content-types/page-footer";
import { getContentTypeFromEntry } from "../components/shared/utils";
import { mapContentTypeToComponent } from "../components/shared/mapping";

@Component({
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class PageContent {
    fullPath = input<string>();
    standardPageConfig = input<CfStandardPageConfig>();
    pageContent = input<any>();

    header = computed<CfPageHeader>(() => this.standardPageConfig()?.fields?.header);
    footer = computed<CfPageFooter>(() => this.standardPageConfig()?.fields?.footer);

    contentElements = computed<ContentElementData[]>(() => {
        let contentElements: ContentElementData[] = []
        for (const entry of this.pageContent()?.fields?.content) {
            contentElements.push({
                component: this.getComponentOfEntry(entry),
                inputs: {
                    data: entry
                }
            });
        }
        return contentElements;
    });

    getComponentOfEntry(entry: any): Type<void> {
        const contentType = getContentTypeFromEntry(entry);
        return mapContentTypeToComponent(contentType);
    }
}

export interface ContentElementData {
    component: Type<void>;
    inputs: {
        data: any;
    };
}
