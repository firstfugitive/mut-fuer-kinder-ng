import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CfStandardPageConfig } from "../models/contentful-content-types/standard-page-config";

@Component({
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageContent {
    @Input() fullPath: string;
    @Input() standardPageConfig: CfStandardPageConfig;
    
    header() {
        return this.standardPageConfig?.fields?.header;
    }
    
    footer() {
        return this.standardPageConfig?.fields?.footer;
    }
}