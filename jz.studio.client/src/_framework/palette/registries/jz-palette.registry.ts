import { JzShellPalette } from '../models/jz-palette.model';

export const JZ_PALETTES: Readonly<Record<string, JzShellPalette>> = {

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
    popTxt: '#FFF7EA', // warm ivory

    // highlight
    highlight: '#87CEEB',
    highlightTxt: '#FFF7EA',

    logo: 'seagreen',
    logoTxt: 'white',

    // active tab/content boundary
    activeBoundary: '#87CEEB',
    activeBoundaryTxt: '#15181B'
  },

  // =========================================================
  // CHARCOAL
  // graphite / slate cinematic neutral palette
  // =========================================================

  charcoal: {
    name: 'charcoal',

    // surfaces
    clr1: '#2e2e2e', // cool charcoal
    clr2: '#2A3138', // graphite
    clr3: '#1c2126', // slate iron
    clr4: '#3B454F', // muted steel
    clr5: '#535C65', // weathered silver

    // text
    txt1: '#E6E2DB', // soft ivory
    txt2: '#D8D3CB', // warm parchment
    txt3: '#ECE7DF', // pale bone
    txt4: '#F7F1E8', // porcelain white
    txt5: '#15181B', // carbon black

    // accent
    pop: '#b8860b', // antique brass
    popTxt: '#FFF7EA', // warm ivory

    // highlight
    highlight: '#4F5C66',
    highlightTxt: '#FFF7EA',

    logo: '#fff275',
    logoTxt: '#4c86a8',

    // active tab/content boundary
    activeBoundary: '#4F5C66',
    activeBoundaryTxt: '#F2F4F5',

    // technicalAnalysis: {
    //   structure: {
    //     workspace: '#111111',
    //     priceSurface: '#202020',
    //     indicatorSurface: '#161616',
    //     toolbar: '#262626',
    //     border: '#414141',
    //     seam: '#525252',
    //     grid: '#363636',
    //     axis: '#777777',
    //     labelPrimary: '#D8D8D5',
    //     labelSecondary: '#999996'
    //   },
    //   data: {
    //     bullish: '#4BA2C8',
    //     bearish: '#D77F55',
    //     wick: '#AAB8C2',
    //     sma20: '#54A7C7',
    //     sma50: '#D6A451',
    //     sma150: '#A58AC5',
    //     volumeBullish: '#397A96',
    //     volumeBearish: '#A76043',
    //     macd: '#54A7C7',
    //     signal: '#D6A451',
    //     histogramPositive: '#397A96',
    //     histogramNegative: '#A76043',
    //     rsi: '#A58AC5',
    //     reference: '#596166'
    //   },
    //   interaction: {
    //     crosshair: '#C6CED2',
    //     selection: '#87CEEB',
    //     focus: '#A9DDF2',
    //     warning: '#E0A84E',
    //     error: '#E06C5C'
    //   }
    // }
  },

  ebony: {
    name: 'ebony',

    // surfaces
    clr1: '#404030', // cool charcoal
    clr2: '#1b2021', // graphite
    clr3: '#a5ae9e', // slate iron
    clr4: '#3B454F', // muted steel
    clr5: '#535C65', // weathered silver

    // text
    txt1: '#E6E2DB', // soft ivory
    txt2: '#D8D3CB', // warm parchment
    txt3: '#ECE7DF', // pale bone
    txt4: '#F7F1E8', // porcelain white
    txt5: '#15181B', // carbon black

    // accent
    pop: '#b8860b', // antique brass
    popTxt: '#FFF7EA', // warm ivory

    // highlight
    highlight: '#a5ae9e',
    highlightTxt: 'black',

    logo: '#fff275',
    logoTxt: '#4c86a8',

    // active tab/content boundary
    activeBoundary: '#a5ae9e',
    activeBoundaryTxt: 'black',


  },

  // =========================================================
  // GRAPHITE LIGHT
  // dark-gray light palette with crisp near-black typography
  // =========================================================

  graphiteLight: {
    name: 'graphiteLight',

    // surfaces
    clr1: '#747980', // deepest structural gray
    clr2: '#80858C', // shell workspace
    clr3: '#8C9198', // dominant application surface
    clr4: '#9A9FA6', // raised controls
    clr5: '#AAAFB5', // highest surface

    // text
    txt1: '#111315', // primary graphite black
    txt2: '#202428', // secondary ink
    txt3: '#30353A', // tertiary charcoal
    txt4: '#050607', // maximum emphasis
    txt5: '#F7F8F9', // inverse text

    // accent
    pop: '#8A6200', // deep ochre
    popTxt: '#FFFFFF',

    // highlight
    highlight: '#006C87', // deep cyan
    highlightTxt: '#FFFFFF',

    logo: '#111923',
    logoTxt: '#1B2633',

    // active tab/content boundary
    activeBoundary: '#006C87',
    activeBoundaryTxt: '#FFFFFF',


  },

  // =========================================================
  // STEEL LIGHT
  // cool blue-gray palette with crisp near-black typography
  // =========================================================

  steelLight: {
    name: 'steelLight',

    // surfaces
    clr1: '#707983', // deepest structural steel
    clr2: '#7D8791', // cool shell workspace
    clr3: '#8B96A1', // dominant application surface
    clr4: '#9BA6B0', // raised controls
    clr5: '#ADB7C0', // highest surface

    // text
    txt1: '#10151A', // primary blue-black
    txt2: '#20272D', // secondary ink
    txt3: '#303940', // tertiary charcoal
    txt4: '#05080A', // maximum emphasis
    txt5: '#F7F9FA', // inverse text

    // accent
    pop: '#006E78', // deep teal
    popTxt: '#FFFFFF',

    // highlight
    highlight: '#005D82', // ocean blue
    highlightTxt: '#FFFFFF',

    logo: '#111923',
    logoTxt: '#1B2633',

    // active tab/content boundary
    activeBoundary: '#005D82',
    activeBoundaryTxt: '#FFFFFF',


  },

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
    popTxt: '#061014', // abyss teal

    // highlight
    highlight: '#87CEEB',
    highlightTxt: '#FFF7EA',

    logo: '#111923',
    logoTxt: '#1B2633',

    // active tab/content boundary
    activeBoundary: '#87CEEB',
    activeBoundaryTxt: '#061014'
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
    popTxt: '#2a1f0f', // dark caramel

    // highlight
    highlight: '#87CEEB',
    highlightTxt: '#FFF7EA',

    logo: 'yellow',
    logoTxt: 'violet',

    // active tab/content boundary
    activeBoundary: '#87CEEB',
    activeBoundaryTxt: '#191010'
  },


};
