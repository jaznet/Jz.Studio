import {  RectDimensions } from "./techan-interfaces";

// interfaces/panel-attributes.ts
export interface PanelAttributes {
  width: number;
  height: number;
  x: number;     // informational (group is translated)
  y: number;     // informational (group is translated)
  content: any | null;
  spacer: number;
  pct: number;   // height proportion within container
  /** Optional visual hints (not required) */
  fill?: string;
}

