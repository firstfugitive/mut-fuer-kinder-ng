import { EntryFields } from "contentful";
import { CfContentType } from "./content-type";

export interface CfEvent extends CfContentType {
    fields?: {
        name?: EntryFields.Text;
        locationName?: EntryFields.Text;
        location?: EntryFields.Location;
        date?: EntryFields.Date;
        contactDetails?: EntryFields.Text;
        link?: EntryFields.Text;
    }
}