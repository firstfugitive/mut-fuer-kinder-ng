import { Asset, EntryFields } from "contentful";
import { CfContentType } from "./content-type";

export interface CfPageContentBlog extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        title?: EntryFields.Text;
        creationDate?: EntryFields.Date;
        hideCreationDate?: EntryFields.Boolean;
        image?: Asset;
        content?: any[];
    }
}

export interface CfPageContentBlogOverview extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        headline?: EntryFields.Text;
        content?: any[];
    }
}

export interface CfPageContentHome extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        heroImages?: Asset[];
        content?: any[];
    }
}

export interface CfPageContentStandard extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        content?: any[];
    }
}
