import { EntryFields } from "contentful";
import { CfContentType } from "./content-type";
import { CfPage } from "./page";

export interface CfNavigationElement extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        title?: EntryFields.Text;
        link?: CfPage;
    }
}