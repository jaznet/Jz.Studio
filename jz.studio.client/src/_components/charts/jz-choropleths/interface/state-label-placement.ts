//export interface StateLabelPlacement {
//  stateName: string;
//  dx?: number;
//  dy?: number;
//  rotate?: number;
//  fontScale?: number;
//  anchor?: 'start' | 'middle' | 'end';
//}

export interface StateLabelPlacement {
  stateName: string;
  dx?: number;
  dy?: number;
  albersRotate?: number;
  anchor?: 'start' | 'middle' | 'end';
  fontScale?: number;
  visible?: boolean;
}
