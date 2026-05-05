import { JzNavItem } from "../models/jz-nav-item.model";

export const NAV_ITEMS: JzNavItem[] = [
  {
    id: 'jzhome',
    label: 'HoXme',
    route: '/home',
    palette: 'onyx',
    layoutType: 'blank'
  },
  {
    id: 'visualization',
    label: 'Visualization',
    route: '/visualization',
    palette: 'onyx',
    layoutType: 'left-nav-framed'
  },
  {
    id: 'backoffice',
    label: 'Backoffice',
    route: '/backoffice',
    palette: 'coffee',
    layoutType: 'left-nav-framed'
  },
  {
    id: 'sandbox',
    label: 'Sandbox',
    route: '/sandbox',
    palette: 'onyx',
    layoutType: 'blank'
  },
  {
    id: 'architecture',
    label: 'Architecture',
    route: '/architecture',
    palette: 'coffee',
    layoutType: 'framed'
  },
  {
    id: 'admin',
    label: 'Admin',
    route: '/admin',
    palette: 'coffee',
    layoutType: 'left-nav-framed'
  }
];
