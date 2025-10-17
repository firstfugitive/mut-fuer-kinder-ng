import { EntryFields } from "contentful";
import { CfContentType } from "./content-type";
import { CfPage } from "./page";
import { CfNavigationElement } from "./navigation-element";

export interface CfPageHeader extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        title?: EntryFields.Text;
        linkHome?: CfPage;
        linkDonate?: CfPage;
        navigationElements?: CfNavigationElement[];
    }
}