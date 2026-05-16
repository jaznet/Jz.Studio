import { JzPalette } from '../models/jz-palette.model';

export const JZ_PALETTES: Readonly<Record<string, JzPalette>> = {

  // =========================================================
  // MIDNIGHT
  // cool blue-black cinematic palette
  // =========================================================

  midnight: {
    name: 'midnight',

    // surfaces
    clr1: '#0B0F14', // ink black
    clr2: '#111923', // midnight navy
    clr3: '#1B2633', // deep slate blue
    clr4: '#2A3747', // charcoal blue
    clr5: '#3A4A5E', // steel slate

    // text
    txt1: '#F2F5F8', // frost white
    txt2: '#E2E8EF', // cool porcelain
    txt3: '#CBD5E1', // pale silver blue
    txt4: '#AAB7C6', // muted steel
    txt5: '#8C9AAA', // weathered slate

    // accent
    pop: '#16C7E8', // electric cyan
    popTxt: '#061014' // abyss teal
  },

  // =========================================================
  // COFFEE
  // warm espresso / bronze palette
  // =========================================================

  coffee: {
    name: 'coffee',

    // surfaces
    clr1: '#191010', // espresso black
    clr2: '#3d2828', // dark roast
    clr3: '#644040', // roasted mocha
    clr4: '#895858', // cinnamon mocha
    clr5: '#a77676', // dusty rosewood

    // text
    txt1: '#F1E6DC', // warm cream
    txt2: '#E8D6C8', // soft linen
    txt3: '#F5EBDD', // steamed milk
    txt4: '#FFF4E8', // ivory foam
    txt5: '#140A0A', // coffee bean

    // accent
    pop: '#E0A84F', // antique amber
    popTxt: '#2a1f0f' // dark caramel
  },

  // =========================================================
  // ONYX
  // graphite / slate cinematic neutral palette
  // =========================================================

  onyx: {
    name: 'onyx',

    // surfaces
    clr1: '#111417', // cool charcoal
    clr2: '#1C2126', // graphite
    clr3: '#2A3138', // slate iron
    clr4: '#3B454F', // muted steel
    clr5: '#535C65', // weathered silver

    // text
    txt1: '#E6E2DB', // soft ivory
    txt2: '#D8D3CB', // warm parchment
    txt3: '#ECE7DF', // pale bone
    txt4: '#F7F1E8', // porcelain white
    txt5: '#15181B', // carbon black

    // accent
    pop: '#B08D57', // antique brass
    popTxt: '#FFF7EA' // warm ivory
  }
};
