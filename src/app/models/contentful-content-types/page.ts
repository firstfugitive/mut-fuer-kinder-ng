import { Asset, EntryFields } from "contentful";
import { CfUrlSubfolder } from "./url-subfolder";
import { CfContentType } from "./content-type";
import { CfPageContentBlog, CfPageContentBlogOverview } from "./page-content";

export interface CfPage extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        pageTitle?: EntryFields.Text;
        urlSubfolder?: CfUrlSubfolder;
        slug?: EntryFields.Text;
        content?: CfPageContentBlog | CfPageContentBlogOverview // | ...
        openGraphImage: Asset;
        openGraphDescription?: EntryFields.Text;
    }
}