import { EventEmitter, Injectable, Output } from '@angular/core';
import { AppEventsService } from './app-events.service';
import { PaletteMgrService } from './palette-mgr.service';

@Injectable({
  providedIn: 'root'
})
export class AppMgrService {

  @Output() paletteChnagedEvent = new EventEmitter();

  constructor(
    private appEvents: AppEventsService,
    private paletteMgr: PaletteMgrService
  ) {
    this.appEvents.viewSelectedEvent.subscribe((v) => {
      this.OnViewSelected(v);
    });
  }

  InitializePalette() {
    this.paletteMgr.ChangePalette('onyx');
  }

  OnViewSelected(view: any) {
    switch (view) {
      case 'home':
        this.paletteMgr.ChangePalette('rifle');
        break;
      case 'visualization':
        this.paletteMgr.ChangePalette('onyx');
        break;
      case 'equities':
        this.paletteMgr.ChangePalette('onyx');
        break;
      case 'chorodash':
        this.paletteMgr.ChangePalette('onyx');
        break;
      case 'gears':
        this.paletteMgr.ChangePalette('xyno');
        break;
    }
  }

  //ChangePalette(palette: string) {
  //  this.paletteChnagedEvent.emit(palette);
  //  switch (palette) {

  //    case 'rifle':
  //      document.documentElement.style.setProperty('--jz-palette-border', 'var(--jz-palette-color-1');
  //      document.documentElement.style.setProperty('--jz-palette-app-body', 'var(--jz-palette-color-1');
  //      document.documentElement.style.setProperty('--jz-palette-text-1', '#A6BFC9');
  //      document.documentElement.style.setProperty('--jz-palette-text-2', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-text-3', '#85A8C7');
  //      document.documentElement.style.setProperty('--jz-palette-text-4', '#85A8C7');
  //      document.documentElement.style.setProperty('--jz-palette-text-5', 'white');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-light', '#f0f0ff');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

  //      document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
  //      document.documentElement.style.setProperty('--popup-color-2', '#679267');
  //      document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

  //      document.documentElement.style.setProperty('--jz-palette-color-0', '#032130');

  //      document.documentElement.style.setProperty('--jz-palette-color-1', '#0F1711');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-hi', '#05354C');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-lo', '#031A26');

  //      document.documentElement.style.setProperty('--jz-palette-color-2', '#032130');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#0e4981');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#092948');

  //      document.documentElement.style.setProperty('--jz-palette-color-3', '#4D7355');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-hi', '#0988AE');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-lo', '#0076A8854B61');

  //      document.documentElement.style.setProperty('--jz-palette-color-4', '#739E7D');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-hi', '#93B2CD');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-lo', '#779EC0');

  //      document.documentElement.style.setProperty('--jz-palette-color-5', '#78C488');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-hi', '#D2D7C6');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-lo', '#ACB597');

  //      document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

  //      document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
  //      document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
  //      document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
  //      document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
  //      document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--jz-palette-color-4');
  //      break;

  //    case 'oxford':
  //      document.documentElement.style.setProperty('--jz-palette-border', 'var(--jz-palette-color-1');
  //      document.documentElement.style.setProperty('--jz-palette-app-body', 'var(--jz-palette-color-1');
  //      document.documentElement.style.setProperty('--jz-palette-text-1', '#A6BFC9');
  //      document.documentElement.style.setProperty('--jz-palette-text-2', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-text-3', '#85A8C7');
  //      document.documentElement.style.setProperty('--jz-palette-text-4', '#85A8C7');
  //      document.documentElement.style.setProperty('--jz-palette-text-5', 'white');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-light', '#f0f0ff');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

  //      document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
  //      document.documentElement.style.setProperty('--popup-color-2', '#679267');
  //      document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

  //      document.documentElement.style.setProperty('--jz-palette-color-0', '#032130');

  //      document.documentElement.style.setProperty('--jz-palette-color-1', '#04283A');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-hi', '#05354C');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-lo', '#031A26');

  //      document.documentElement.style.setProperty('--jz-palette-color-2', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#0e4981');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#092948');

  //      document.documentElement.style.setProperty('--jz-palette-color-3', '#08799B');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-hi', '#0988AE');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-lo', '#0076A8854B61');

  //      document.documentElement.style.setProperty('--jz-palette-color-4', '#85A8C7');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-hi', '#93B2CD');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-lo', '#779EC0');

  //      document.documentElement.style.setProperty('--jz-palette-color-5', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-hi', '#D2D7C6');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-lo', '#ACB597');

  //      document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

  //      document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
  //      document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
  //      document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
  //      document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
  //      document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--jz-palette-color-4');
  //      break;

  //    case 'indigo':
  //      document.documentElement.style.setProperty('--jz-palette-border', '#51B0CD');
  //      document.documentElement.style.setProperty('--jz-palette-text-1', '#87ceeb');
  //      document.documentElement.style.setProperty('--jz-palette-text-2', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-text-3', '#0DBDF2');
  //      document.documentElement.style.setProperty('--jz-palette-text-4', '#A9CEF4');
  //      document.documentElement.style.setProperty('--jz-palette-text-5', 'white');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-light', '#f0f0ff');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

  //      document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
  //      document.documentElement.style.setProperty('--popup-color-2', '#679267');
  //      document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

  //      document.documentElement.style.setProperty('--jz-palette-color-1', '#0B345B');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-hi', '#0F4980');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-lo', '#071F36');

  //      document.documentElement.style.setProperty('--jz-palette-color-2', '#076A88');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#08799B');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#065B74');

  //      document.documentElement.style.setProperty('--jz-palette-color-3', '#69BBD3');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-hi', '#81C5DA');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-lo', '#51B0CD');

  //      document.documentElement.style.setProperty('--jz-palette-color-4', '#A9CEF4');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-hi', '#A0ADBA');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-lo', '#8998A9');

  //      document.documentElement.style.setProperty('--jz-palette-color-5', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-hi', '#D2D7C6');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-lo', '#ACB597');

  //      document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

  //      document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
  //      document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
  //      document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
  //      document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
  //      document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--jz-palette-color-4');
  //      break;

  //    case 'onyx':
  //      document.documentElement.style.setProperty('--jz-palette-border', 'var(--jz-palette-color-3');
  //      document.documentElement.style.setProperty('--jz-palette-text-1', 'black');
  //      document.documentElement.style.setProperty('--jz-palette-text-2', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-text-3', '#B6AFAF');
  //      document.documentElement.style.setProperty('--jz-palette-text-4', '#ABC4BD');
  //      document.documentElement.style.setProperty('--jz-palette-text-5', '#6ED8C1');
  //      document.documentElement.style.setProperty('--jz-palette-menu-title', '#7F7676');

  //      document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
  //      document.documentElement.style.setProperty('--popup-color-2', '#679267');
  //      document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

  //      document.documentElement.style.setProperty('--jz-palette-color-1', '#001414');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-hi', '#292929');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-lo', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-color-2', '#272a2a');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#313535');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#1D2020');

  //      document.documentElement.style.setProperty('--jz-palette-color-3', '#39615D');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-hi', '#226D5C');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-lo', '#0E2F27');

  //      document.documentElement.style.setProperty('--jz-palette-color-4', '#7BA397');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-hi', '#87ABA0');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-lo', '#6F9B8D');

  //      document.documentElement.style.setProperty('--jz-palette-color-5', '#6ED8C1');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-hi', '#D2D7C6');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-lo', '#ACB597');

  //      document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

  //      document.documentElement.style.setProperty('--jz-palette-color-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-light', '#ffffff');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
  //      document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
  //      document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
  //      document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
  //      document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--jz-palette-color-4');
  //      break;

  //    case 'xyno':
  //      document.documentElement.style.setProperty('--jz-palette-border', 'var(--jz-palette-color-3');
  //      document.documentElement.style.setProperty('--jz-palette-text-1', 'black');
  //      document.documentElement.style.setProperty('--jz-palette-text-2', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-text-3', '#B6AFAF');
  //      document.documentElement.style.setProperty('--jz-palette-text-4', '#ABC4BD');
  //      document.documentElement.style.setProperty('--jz-palette-text-5', '#6ED8C1');
  //      document.documentElement.style.setProperty('--jz-palette-menu-title', '#7F7676');

  //      document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
  //      document.documentElement.style.setProperty('--popup-color-2', '#679267');
  //      document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

  //      document.documentElement.style.setProperty('--jz-palette-color-1', '#001414');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-hi', '#292929');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-lo', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-color-3', '#272a2a');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-hi', '#313535');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-lo', '#1D2020');

  //      document.documentElement.style.setProperty('--jz-palette-color-2', '#39615D');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#226D5C');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#0E2F27');

  //      document.documentElement.style.setProperty('--jz-palette-color-4', '#7BA397');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-hi', '#87ABA0');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-lo', '#6F9B8D');

  //      document.documentElement.style.setProperty('--jz-palette-color-5', '#6ED8C1');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-hi', '#D2D7C6');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-lo', '#ACB597');

  //      document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

  //      document.documentElement.style.setProperty('--jz-palette-color-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-light', '#ffffff');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
  //      document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
  //      document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
  //      document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
  //      document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--jz-palette-color-4');
  //      break;

  //    case 'gold':
  //      document.documentElement.style.setProperty('--jz-palette-border', 'var(--jz-palette-color-3');
  //      document.documentElement.style.setProperty('--jz-palette-text-1', 'black');
  //      document.documentElement.style.setProperty('--jz-palette-text-2', '#F4EFDC');
  //      document.documentElement.style.setProperty('--jz-palette-text-3', '#7F7676');
  //      document.documentElement.style.setProperty('--jz-palette-text-4', '#A7A0A0');
  //      document.documentElement.style.setProperty('--jz-palette-text-5', 'white');
  //      document.documentElement.style.setProperty('--jz-palette-menu-title', '#7F7676');

  //      document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
  //      document.documentElement.style.setProperty('--popup-color-2', '#679267');
  //      document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

  //      document.documentElement.style.setProperty('--jz-palette-color-0', 'var(--jz-palette-color-1');

  //      document.documentElement.style.setProperty('--jz-palette-color-1', '#2A2727');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-hi', '#403B3B');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-lo', '#151414');

  //      document.documentElement.style.setProperty('--jz-palette-color-2', '#3B4040');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#3B4040');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#272A2A');

  //      document.documentElement.style.setProperty('--jz-palette-color-3', '#5f5959');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-hi', '#5F5959');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-lo', '#353131');

  //      document.documentElement.style.setProperty('--jz-palette-color-4', '#938A8A');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-hi', '#A7A0A0');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-lo', '#7F7676');

  //      document.documentElement.style.setProperty('--jz-palette-color-5', '#D1B96B');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-hi', '#D9C482');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-lo', '#6A6262');

  //      document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

  //      document.documentElement.style.setProperty('--jz-palette-color-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-light', '#ffffff');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
  //      document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
  //      document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
  //      document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
  //      document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--jz-palette-color-4');
  //      break;

  //    case 'red':
  //      document.documentElement.style.setProperty('--jz-palette-border', 'var(--jz-palette-color-3)');
  //      document.documentElement.style.setProperty('--jz-palette-text-1', 'skyblue');
  //      document.documentElement.style.setProperty('--jz-palette-text-2', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-text-3', 'black');
  //      document.documentElement.style.setProperty('--jz-palette-text-4', '#0DBDF2');
  //      document.documentElement.style.setProperty('--jz-palette-text-5', '#9DB9D2');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-light', '#f0f0ff');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

  //      document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
  //      document.documentElement.style.setProperty('--popup-color-2', '#679267');
  //      document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

  //      document.documentElement.style.setProperty('--jz-palette-color-1', '#320101');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-hi', '#0D3F6D');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-lo', '#092A49');

  //      document.documentElement.style.setProperty('--jz-palette-color-2', '#4A0202');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-hi', '##08799B');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#065B74');

  //      document.documentElement.style.setProperty('--jz-palette-color-3', '#7D0404');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-hi', '#96D5ED');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-lo', '#73C7E7');

  //      document.documentElement.style.setProperty('--jz-palette-color-4', '#BD0404');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-hi', '#A0ADBA');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-lo', '#8998A9');

  //      document.documentElement.style.setProperty('--jz-palette-color-5', '#F00202');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-hi', '#D2D7C6');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-lo', '#ACB597');

  //      document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

  //      document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
  //      document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
  //      document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
  //      document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
  //      document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--jz-palette-color-4');
  //      break;

  //    case 'bistre':
  //      document.documentElement.style.setProperty('--jz-palette-border', 'var(--jz-palette-color-3-lo');
  //      document.documentElement.style.setProperty('--jz-palette-text-1', 'black');
  //      document.documentElement.style.setProperty('--jz-palette-text-2', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-text-3', '#C6AE95');
  //      document.documentElement.style.setProperty('--jz-palette-text-4', 'black');
  //      document.documentElement.style.setProperty('--jz-palette-text-5', 'white');

  //      document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
  //      document.documentElement.style.setProperty('--popup-color-2', '#679267');
  //      document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

  //      document.documentElement.style.setProperty('--jz-palette-color-0', 'var(--jz-palette-color-1');

  //      document.documentElement.style.setProperty('--jz-palette-color-1', '#2C1B14');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-hi', '#382319');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-lo', '#1C110D');

  //      document.documentElement.style.setProperty('--jz-palette-color-2', '#3E3328');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#4B3D30');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#322920');

  //      document.documentElement.style.setProperty('--jz-palette-color-3', '#C6AE95');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-hi', '#C6AE95');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-lo', '#BFA488');

  //      document.documentElement.style.setProperty('--jz-palette-color-4', '#A17544');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-hi', '#87ABA0');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-lo', '#6F9B8D');

  //      document.documentElement.style.setProperty('--jz-palette-color-5', '#F3F9D2');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-hi', '#D2D7C6');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-lo', '#ACB597');

  //      document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

  //      document.documentElement.style.setProperty('--jz-palette-color-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-light', '#ffffff');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
  //      document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
  //      document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
  //      document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
  //      document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--jz-palette-color-4');
  //      break;

  //    case 'coffee':
  //      document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
  //      document.documentElement.style.setProperty('--popup-color-2', '#679267');
  //      document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

  //      document.documentElement.style.setProperty('--jz-palette-color-1', '#2A0800');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-hi', '#3E4C38');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-lo', '#181D16');

  //      document.documentElement.style.setProperty('--jz-palette-color-2', '#754F43');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#82584A');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#68473C');

  //      document.documentElement.style.setProperty('--jz-palette-color-3', '#C09891');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-lo', '#065B74');

  //      document.documentElement.style.setProperty('--jz-palette-color-4', '#BEA8A7');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-hi', '#A0ADBA');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-lo', '#8998A9');

  //      document.documentElement.style.setProperty('--jz-palette-color-5', '#F4DBD8');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-hi', '#D2D7C6');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-lo', '#ACB597');

  //      document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

  //      document.documentElement.style.setProperty('--jz-palette-color-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-light', '#ffffff');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
  //      document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
  //      document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
  //      document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
  //      document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--jz-palette-color-4');
  //      break;

  //    case 'jungle':
  //      document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
  //      document.documentElement.style.setProperty('--popup-color-2', '#679267');
  //      document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

  //      document.documentElement.style.setProperty('--jz-palette-color-1', '#111815');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-hi', '#3E4C38');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-lo', '#181D16');

  //      document.documentElement.style.setProperty('--jz-palette-color-2', '#24322D');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#82584A');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#68473C');

  //      document.documentElement.style.setProperty('--jz-palette-color-3', '#3B5249');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-lo', '#065B74');

  //      document.documentElement.style.setProperty('--jz-palette-color-4', '#4EA699');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-hi', '#A0ADBA');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-lo', '#8998A9');

  //      document.documentElement.style.setProperty('--jz-palette-color-5', '#D2D7C6');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-hi', '#D2D7C6');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-lo', '#ACB597');

  //      document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

  //      document.documentElement.style.setProperty('--jz-palette-color-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-light', '#ffffff');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
  //      document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
  //      document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
  //      document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
  //      document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--jz-palette-color-4');
  //      break;

  //    case 'olive':
  //      document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
  //      document.documentElement.style.setProperty('--popup-color-2', '#679267');
  //      document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

  //      document.documentElement.style.setProperty('--jz-palette-color-1', '#303631');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-hi', '#3E4C38');
  //      document.documentElement.style.setProperty('--jz-palette-color-1-lo', '#181D16');

  //      document.documentElement.style.setProperty('--jz-palette-color-2', '#434C45');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#82584A');
  //      document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#68473C');

  //      document.documentElement.style.setProperty('--jz-palette-color-3', '#667761');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-color-3-lo', '#065B74');

  //      document.documentElement.style.setProperty('--jz-palette-color-4', '#B79492');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-hi', '#A0ADBA');
  //      document.documentElement.style.setProperty('--jz-palette-color-4-lo', '#8998A9');

  //      document.documentElement.style.setProperty('--jz-palette-color-5', '#EAE1DF');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-hi', '#D2D7C6');
  //      document.documentElement.style.setProperty('--jz-palette-color-5-lo', '#ACB597');

  //      document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
  //      document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

  //      document.documentElement.style.setProperty('--jz-palette-color-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-light', '#ffffff');
  //      document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
  //      document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
  //      document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
  //      document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
  //      document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
  //      document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
  //      document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

  //      document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
  //      document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--jz-palette-color-4');
  //      break;

  //    default:
  //  }
  //}
}
