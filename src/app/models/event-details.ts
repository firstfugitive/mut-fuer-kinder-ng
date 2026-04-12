import { CfEvent } from "./contentful-content-types/event";

export interface EventDetails {
  event: CfEvent;
  formattedAddress: string;
}
