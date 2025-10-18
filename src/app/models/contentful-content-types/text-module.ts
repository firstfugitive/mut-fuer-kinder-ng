import { EntryFields } from "contentful";
import { CfContentType } from "./content-type";

export interface CfTextModule extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        text?: EntryFields.Text;
        big?: EntryFields.Boolean;
        bold?: EntryFields.Boolean;
        headline?: EntryFields.Boolean;
        gotham?: EntryFields.Boolean;
        align?: EntryFields.Text;
        htmlTag?: EntryFields.Text;
    }
}
