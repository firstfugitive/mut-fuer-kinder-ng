import { Asset, EntryFields } from "contentful";
import { CfContentType } from "./content-type";
import { CfPageFooter } from "./page-footer";

export interface CfStandardPageConfig extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        header?: any;
        footer?: CfPageFooter;
        openGraphStandardImage: Asset;
        openGraphStandardDescription?: EntryFields.Text;
    }
}