import { Component, Input } from "@angular/core";

@Component({
    template: "",
})
export abstract class PageContent {
    @Input() data: any;
    @Input() fullPath: string = "";
    @Input() standardPageConfig: any;
}