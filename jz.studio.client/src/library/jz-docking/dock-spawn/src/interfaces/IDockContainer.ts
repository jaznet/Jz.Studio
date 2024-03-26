import { ContainerType } from "../ContainerType";
import { DockManager } from "../DockManager";
import { IState } from "./IState";
import { TabPage } from '../TabPage';
import { ISize } from "./ISize";

export interface IDockContainer {
  readonly dockManager: DockManager;
  resize(_width: number | null | undefined, _height: number | null | undefined): void;
  performLayout(children: IDockContainer[], relayoutEvenIfEqual: boolean): void;
  destroy(): void;
  setActiveChild(child: IDockContainer): void;
  saveState(state: IState): void;
  loadState(state: IState): void;
  readonly containerElement: HTMLElement;
  containerType: ContainerType;

  // Allow width and height to be number, null, or undefined
  readonly width: number | null | undefined;
  readonly height: number | null | undefined;

  name: string;
  tabPage?: TabPage | null;

  readonly minimumAllowedChildNodes: number;
}

