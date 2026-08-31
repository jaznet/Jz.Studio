import { JzPalette } from '../models/jz-palette.model';

type JzPaletteColorProperty = Exclude<keyof JzPalette, 'technicalAnalysis'>;

export const JZ_PALETTE_CSS_VARIABLES: Readonly<Record<string, JzPaletteColorProperty>> = {
  '--plt-clr-1': 'clr1',
  '--plt-clr-2': 'clr2',
  '--plt-clr-3': 'clr3',
  '--plt-clr-4': 'clr4',
  '--plt-clr-5': 'clr5',

  '--plt-txt-1': 'txt1',
  '--plt-txt-2': 'txt2',
  '--plt-txt-3': 'txt3',
  '--plt-txt-4': 'txt4',
  '--plt-txt-5': 'txt5',

  '--plt-pop': 'pop',
  '--plt-pop-txt': 'popTxt'
};
