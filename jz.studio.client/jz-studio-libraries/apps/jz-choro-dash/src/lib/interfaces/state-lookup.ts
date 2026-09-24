export interface StateLookup {
  fips: string;
  stateName: string;
  stateAbbr: string;

  albersRotate?: number;
  dx?: number;
  dy?: number;

  fontScale?: number;
  anchor?: 'start' | 'middle' | 'end';
  hidden?: boolean;
}
