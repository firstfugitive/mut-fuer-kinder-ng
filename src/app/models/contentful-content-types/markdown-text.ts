import { EntryFields, EntrySkeletonType } from "contentful";
import { CfPage } from "./page";
import { CfContentType } from "./content-type";


export interface CfMarkdownText extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        text?: EntryFields.Text;
        align?: EntryFields.Text;
    }
}