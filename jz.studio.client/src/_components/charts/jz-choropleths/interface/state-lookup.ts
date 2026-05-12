export interface StateLookup {
  stateName: string;
  fips: string;
  stateAbbr:string

  dx?: number;
  dy?: number;

  albersRotate?: number;

  anchor?: 'start' | 'middle' | 'end';

  fontScale?: number;
}
