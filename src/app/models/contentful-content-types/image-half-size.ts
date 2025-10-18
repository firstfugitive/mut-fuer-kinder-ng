import { Asset, EntryFields } from "contentful";
import { CfContentType } from "./content-type";

export interface CfImageHalfSize extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        image?: Asset;
        small?: EntryFields.Boolean;
    }
}