import { JzNavItem } from "../models/jz-nav-item.model";

export const NAV_ITEMS: JzNavItem[] = [
  {
    id: 'home',
    label: 'HoXme',
    route: '/home',
    layoutType: 'blank'
  },
  {
    id: 'visualization',
    label: 'Visualization',
    route: '/visualization',
    layoutType: 'left-nav-framed'
  },
  {
    id: 'backoffice',
    label: 'Backoffice',
    route: '/backoffice',
    layoutType: 'left-nav-framed'
  },
  {
    id: 'sandbox',
    label: 'Sandbox',
    route: '/sandbox',
    layoutType: 'blank'
  },
  {
    id: 'architecture',
    label: 'Architecture',
    route: '/architecture',
    layoutType: 'framed'
  },
  {
    id: 'admin',
    label: 'Admin',
    route: '/admin',
    layoutType: 'left-nav-framed'
  }
];
