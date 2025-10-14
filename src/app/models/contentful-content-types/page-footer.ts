import { EntryFields, EntrySkeletonType } from "contentful";
import { CfPage } from "./page";
import { CfContentType } from "./content-type";


export interface CfPageFooter extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        copyright?: EntryFields.Text;
        imprint?: CfPage;
        dataProtection?: CfPage;
    }
}