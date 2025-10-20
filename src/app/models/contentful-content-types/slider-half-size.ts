import { Asset, EntryFields } from "contentful";
import { CfContentType } from "./content-type";
import { CfPage } from "./page";
import { CfMarkdownText } from "./markdown-text";

export interface CfSliderHalfSize extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        images?: Asset[];
        small?: EntryFields.Boolean;
    }
}