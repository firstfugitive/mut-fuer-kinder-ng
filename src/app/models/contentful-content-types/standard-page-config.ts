import { Asset, EntryFields } from "contentful";
import { CfContentType } from "./content-type";
import { CfPage } from "./page";
import { CfPageFooter } from "./page-footer";

export interface CfStandardPageConfig extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        header?: any;
        footer?: CfPageFooter;
        openGraphImage: Asset;
        openGraphDescription?: EntryFields.Text;
    }
}