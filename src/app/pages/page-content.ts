import { ChangeDetectionStrategy, Component, computed, input, Type } from "@angular/core";
import { CfStandardPageConfig } from "../models/contentful-content-types/standard-page-config";
import { CfPageHeader } from "../models/contentful-content-types/page-header";
import { CfPageFooter } from "../models/contentful-content-types/page-footer";
import { getContentTypeFromEntry, mapContentTypeToComponent } from "../components/shared/util";

@Component({
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageContent {
    fullPath = input<string>();
    standardPageConfig = input<CfStandardPageConfig>();

    header = computed<CfPageHeader>(() => this.standardPageConfig()?.fields?.header);
    footer = computed<CfPageFooter>(() => this.standardPageConfig()?.fields?.footer);

    getComponentOfEntry(entry: any): Type<void> {
        const contentType = getContentTypeFromEntry(entry);
        return mapContentTypeToComponent(contentType);
    }
}
