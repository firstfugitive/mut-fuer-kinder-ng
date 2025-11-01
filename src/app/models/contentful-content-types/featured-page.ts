import { EntryFields } from "contentful";
import { CfContentType } from "./content-type";
import { CfPage } from "./page";
import { CfMarkdownText } from "./markdown-text";

export interface CfFeaturedPage extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        page?: CfPage;
        text?: CfMarkdownText;
        headline?: EntryFields.Text;
        linkText?: EntryFields.Text;
        alternativeBackground?: EntryFields.Boolean;
    }
}