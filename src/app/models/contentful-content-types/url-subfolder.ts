import { EntryFields } from "contentful";
import { CfContentType } from "./content-type";

export interface CfUrlSubfolder extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        path?: EntryFields.Text;
    }
}