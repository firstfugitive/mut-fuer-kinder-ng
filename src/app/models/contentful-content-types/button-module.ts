import { EntryFields } from "contentful";
import { CfContentType } from "./content-type";
import { CfPage } from "./page";

export interface CfButtonModule extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        text?: EntryFields.Text;
        linkedPage?: CfPage;
        isPaypalButton?: EntryFields.Boolean;
        paypalUrl?: EntryFields.Text;
    }
}