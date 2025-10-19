import { Asset, EntryFields } from "contentful";
import { CfContentType } from "./content-type";

export interface CfImagePerson extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        image?: Asset;
    }
}