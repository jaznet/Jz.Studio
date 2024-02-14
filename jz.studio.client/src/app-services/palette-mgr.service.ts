import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaletteMgrService {

  @Output() paletteChangedEvent = new EventEmitter();

  constructor() { }

  InitializePalette() {
    this.ChangePalette('gold');
  }

  ChangePalette(palette: string) {
    this.paletteChangedEvent.emit(palette);
    switch (palette) {

      case 'gold':

        document.documentElement.style.setProperty('--plt-clr-1', '#406B6B');
        document.documentElement.style.setProperty('--plt-clr-2', '#172626');
        document.documentElement.style.setProperty('--plt-clr-3', '#2f9d87');
        document.documentElement.style.setProperty('--plt-clr-4', '#c4c287');
        document.documentElement.style.setProperty('--plt-clr-5', '#F5FBFB');

        document.documentElement.style.setProperty('--plt-txt-1', 'black');
        document.documentElement.style.setProperty('--plt-txt-2', '#D4CD9B');
        document.documentElement.style.setProperty('--plt-txt-3', '#B7AC57');
        document.documentElement.style.setProperty('--plt-txt-4', 'black');
        document.documentElement.style.setProperty('--plt-txt-5', 'white');

        document.documentElement.style.setProperty('--jz-palette-border', 'var(--plt-clr-3');

        document.documentElement.style.setProperty('--popup-color-1', '#FFDC5E');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        break;

      case 'gold-2':

        document.documentElement.style.setProperty('--plt-clr-1', '#172626');
        document.documentElement.style.setProperty('--plt-clr-2', '#406B6B');
        document.documentElement.style.setProperty('--plt-clr-3', '#2f9d87');
        document.documentElement.style.setProperty('--plt-clr-4', '#c4c287');
        document.documentElement.style.setProperty('--plt-clr-5', '#F5FBFB');

        document.documentElement.style.setProperty('--plt-txt-1', 'black');
        document.documentElement.style.setProperty('--plt-txt-2', '#D4CD9B');
        document.documentElement.style.setProperty('--plt-txt-3', '#B7AC57');
        document.documentElement.style.setProperty('--plt-txt-4', 'black');
        document.documentElement.style.setProperty('--plt-txt-5', 'white');

        document.documentElement.style.setProperty('--jz-palette-border', 'var(--plt-clr-3');

        document.documentElement.style.setProperty('--popup-color-1', '#FFDC5E');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        break;

      case 'onyx':

        document.documentElement.style.setProperty('--plt-clr-1', '#001414');
        document.documentElement.style.setProperty('--plt-clr-2', '#272a2a');
        document.documentElement.style.setProperty('--plt-clr-3', '#39615D');
        document.documentElement.style.setProperty('--plt-clr-4', '#7BA397');
        document.documentElement.style.setProperty('--plt-clr-5', '#6ED8C1');

        document.documentElement.style.setProperty('--plt-txt-1', 'white');
        document.documentElement.style.setProperty('--plt-txt-2', '#D4CD9B');
        document.documentElement.style.setProperty('--plt-txt-3', '#B7AC57');
        document.documentElement.style.setProperty('--plt-txt-4', 'black');
        document.documentElement.style.setProperty('--plt-txt-5', 'white');

        document.documentElement.style.setProperty('--jz-palette-border', 'var(--plt-clr-3');

        document.documentElement.style.setProperty('--popup-color-1', '#FFDC5E');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        break; 

      case 'indigo':

        document.documentElement.style.setProperty('--plt-clr-1', '#445469');
        document.documentElement.style.setProperty('--jz-palette-color-2', '#20334C');
        document.documentElement.style.setProperty('--plt-clr-3', '#8DAA9D');
        document.documentElement.style.setProperty('--plt-clr-4', '#A9CEF4');
        document.documentElement.style.setProperty('--plt-clr-5', '#DCE6EF');

        document.documentElement.style.setProperty('--plt-txt-1', 'black');
        document.documentElement.style.setProperty('--plt-txt-2', '#F6F7F9');
        document.documentElement.style.setProperty('--plt-txt-3', 'black');
        document.documentElement.style.setProperty('--plt-txt-4', '#A9CEF4');
        document.documentElement.style.setProperty('--plt-txt-5', '#DCE6EF');

        document.documentElement.style.setProperty('--jz-palette-border', 'var(--plt-clr-3');

        document.documentElement.style.setProperty('--popup-color-1', '#FFDC5E');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        break;

      case 'bistre':
        document.documentElement.style.setProperty('--plt-clr-1', '#ffffff');
        document.documentElement.style.setProperty('--jz-palette-color-2', '#ffffff');
        document.documentElement.style.setProperty('--plt-clr-3', '#000000');
        document.documentElement.style.setProperty('--plt-clr-4', '#0000ff');
        document.documentElement.style.setProperty('--plt-clr-5', '#ff0000');

        document.documentElement.style.setProperty('--plt-txt-1', '#CBCBB0');
        document.documentElement.style.setProperty('--plt-txt-2', '#D7AE46');
        document.documentElement.style.setProperty('--plt-txt-3', 'var(--plt-clr-4');
        document.documentElement.style.setProperty('--plt-txt-4', 'black');
        document.documentElement.style.setProperty('--plt-txt-5', 'white');

        document.documentElement.style.setProperty('--jz-palette-border', 'var(--plt-clr-3');

        document.documentElement.style.setProperty('--popup-color-1', '#FFDC5E');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        break;

      case 'welcome':
        document.documentElement.style.setProperty('--jz-palette-border', 'black');
        document.documentElement.style.setProperty('--plt-txt-1', '#336699');
        document.documentElement.style.setProperty('--plt-txt-2', '#faebd7');
        document.documentElement.style.setProperty('--plt-txt-3', '#B6AFAF');
        document.documentElement.style.setProperty('--plt-txt-4', '#ABC4BD');
        document.documentElement.style.setProperty('--plt-txt-5', '#6ED8C1');
        document.documentElement.style.setProperty('--jz-palette-menu-title', '#7F7676');

        document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        document.documentElement.style.setProperty('--jz-palette-color-0', '#001414');

        document.documentElement.style.setProperty('--plt-clr-1', '#001414');
        document.documentElement.style.setProperty('--plt-clr-1-hi', '#292929');
        document.documentElement.style.setProperty('--plt-clr-1-lo', '#000000');

        document.documentElement.style.setProperty('--jz-palette-color-2', '#001414');
        document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#313535');
        document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#1D2020');

        document.documentElement.style.setProperty('--plt-clr-3', '#001414');
        document.documentElement.style.setProperty('--plt-clr-3-hi', '#226D5C');
        document.documentElement.style.setProperty('--plt-clr-3-lo', '#0E2F27');

        document.documentElement.style.setProperty('--plt-clr-4', '#7BA397');
        document.documentElement.style.setProperty('--plt-clr-4-hi', '#87ABA0');
        document.documentElement.style.setProperty('--plt-clr-4-lo', '#6F9B8D');

        document.documentElement.style.setProperty('--plt-clr-5', '#6ED8C1');
        document.documentElement.style.setProperty('--plt-clr-5-hi', '#D2D7C6');
        document.documentElement.style.setProperty('--plt-clr-5-lo', '#ACB597');

        document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
        document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
        document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

        document.documentElement.style.setProperty('--jz-palette-color-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-color-text-light', '#ffffff');
        document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

        document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
        document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
        document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
        document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
        document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
        document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
        document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

        document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
        document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--plt-clr-4');
        break;

     

      case 'gray':
        document.documentElement.style.setProperty('--jz-palette-border', 'var(--plt-clr-3');
        document.documentElement.style.setProperty('--jz-palette-highlight', '#F5EE9E');
        document.documentElement.style.setProperty('--plt-txt-1', 'var(--plt-clr-5');
        document.documentElement.style.setProperty('--plt-txt-2', '#0C3A64');
        document.documentElement.style.setProperty('--plt-txt-3', 'black');
        document.documentElement.style.setProperty('--plt-txt-4', '#ABC4BD');
        document.documentElement.style.setProperty('--plt-txt-5', '#6ED8C1');
        document.documentElement.style.setProperty('--jz-palette-menu-title', '#7F7676');

        document.documentElement.style.setProperty('--jz-palette-color-0', '#D8D78F');
        document.documentElement.style.setProperty('--plt-clr-1', '#38302E');
        document.documentElement.style.setProperty('--jz-palette-color-2', '#6F6866');
        document.documentElement.style.setProperty('--plt-clr-3', '#9D8585');
        document.documentElement.style.setProperty('--plt-clr-4', '#9CAEA9');
        document.documentElement.style.setProperty('--plt-clr-5', '#CCDAD1');

        document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
        document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
        document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

        document.documentElement.style.setProperty('--jz-palette-color-text', '#DCE6EF');

        break;

      case 'olive':
        document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        document.documentElement.style.setProperty('--jz-palette-color-0', '#303631');

        document.documentElement.style.setProperty('--plt-clr-1', '#303631');
        document.documentElement.style.setProperty('--plt-clr-1-hi', '#3E4C38');
        document.documentElement.style.setProperty('--plt-clr-1-lo', '#181D16');

        document.documentElement.style.setProperty('--jz-palette-color-2', '#434C45');
        document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#82584A');
        document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#68473C');

        document.documentElement.style.setProperty('--plt-clr-3', '#667761');
        document.documentElement.style.setProperty('--plt-clr-3-hi', '#0A97C2');
        document.documentElement.style.setProperty('--plt-clr-3-lo', '#065B74');

        document.documentElement.style.setProperty('--plt-clr-4', '#B79492');
        document.documentElement.style.setProperty('--plt-clr-4-hi', '#A0ADBA');
        document.documentElement.style.setProperty('--plt-clr-4-lo', '#8998A9');

        document.documentElement.style.setProperty('--plt-clr-5', '#EAE1DF');
        document.documentElement.style.setProperty('--plt-clr-5-hi', '#D2D7C6');
        document.documentElement.style.setProperty('--plt-clr-5-lo', '#ACB597');

        document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
        document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
        document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

        document.documentElement.style.setProperty('--jz-palette-color-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-color-text-light', '#ffffff');
        document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

        document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
        document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
        document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
        document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
        document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
        document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
        document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

        document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
        document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--plt-clr-4');
        break;

      case 'xyno':
        document.documentElement.style.setProperty('--jz-palette-border', 'var(--plt-clr-3');
        document.documentElement.style.setProperty('--plt-txt-1', 'black');
        document.documentElement.style.setProperty('--plt-txt-2', '#0C3A64');
        document.documentElement.style.setProperty('--plt-txt-3', '#B6AFAF');
        document.documentElement.style.setProperty('--plt-txt-4', '#ABC4BD');
        document.documentElement.style.setProperty('--plt-txt-5', '#6ED8C1');
        document.documentElement.style.setProperty('--jz-palette-menu-title', '#7F7676');

        document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        document.documentElement.style.setProperty('--jz-palette-color-0', '#001414');

        document.documentElement.style.setProperty('--plt-clr-1', '#001414');
        document.documentElement.style.setProperty('--plt-clr-1-hi', '#292929');
        document.documentElement.style.setProperty('--plt-clr-1-lo', '#000000');

        document.documentElement.style.setProperty('--plt-clr-3', '#272a2a');
        document.documentElement.style.setProperty('--plt-clr-3-hi', '#313535');
        document.documentElement.style.setProperty('--plt-clr-3-lo', '#1D2020');

        document.documentElement.style.setProperty('--jz-palette-color-2', '#39615D');
        document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#226D5C');
        document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#0E2F27');

        document.documentElement.style.setProperty('--plt-clr-4', '#7BA397');
        document.documentElement.style.setProperty('--plt-clr-4-hi', '#87ABA0');
        document.documentElement.style.setProperty('--plt-clr-4-lo', '#6F9B8D');

        document.documentElement.style.setProperty('--plt-clr-5', '#6ED8C1');
        document.documentElement.style.setProperty('--plt-clr-5-hi', '#D2D7C6');
        document.documentElement.style.setProperty('--plt-clr-5-lo', '#ACB597');

        document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
        document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
        document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

        document.documentElement.style.setProperty('--jz-palette-color-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-color-text-light', '#ffffff');
        document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

        document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
        document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
        document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
        document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
        document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
        document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
        document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

        document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
        document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--plt-clr-4');
        break;

      case 'liver':
        document.documentElement.style.setProperty('--jz-palette-border', 'var(--plt-clr-1');
        document.documentElement.style.setProperty('--jz-palette-app-body', 'var(--plt-clr-1');
        document.documentElement.style.setProperty('--plt-txt-1', '#A6BFC9');
        document.documentElement.style.setProperty('--plt-txt-2', '#DCE6EF');
        document.documentElement.style.setProperty('--plt-txt-3', '#85A8C7');
        document.documentElement.style.setProperty('--plt-txt-4', '#85A8C7');
        document.documentElement.style.setProperty('--plt-txt-5', 'white');
        document.documentElement.style.setProperty('--jz-palette-color-text-light', '#f0f0ff');
        document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

        document.documentElement.style.setProperty('--popup-color-1', '#D5AC4E');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        document.documentElement.style.setProperty('--jz-palette-color-0', '#000F08');

        document.documentElement.style.setProperty('--plt-clr-1', '#000F08');
        document.documentElement.style.setProperty('--plt-clr-1-hi', '#05354C');
        document.documentElement.style.setProperty('--plt-clr-1-lo', '#031A26');

        document.documentElement.style.setProperty('--jz-palette-color-2', '#1C3738');
        document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#0e4981');
        document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#092948');

        document.documentElement.style.setProperty('--plt-clr-3', '#4D4847');
        document.documentElement.style.setProperty('--plt-clr-3-hi', '#94B0B3');
        document.documentElement.style.setProperty('--plt-clr-3-lo', '#F4FFF8');

        document.documentElement.style.setProperty('--plt-clr-4', '#8BAAAD');
        document.documentElement.style.setProperty('--plt-clr-4-hi', '#F4FFF8');
        document.documentElement.style.setProperty('--plt-clr-4-lo', '#779EC0');

        document.documentElement.style.setProperty('--plt-clr-5', '#F4FFF8');
        document.documentElement.style.setProperty('--plt-clr-5-hi', '#D2D7C6');
        document.documentElement.style.setProperty('--plt-clr-5-lo', '#ACB597');

        document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
        document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
        document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

        document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
        document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
        document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
        document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
        document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
        document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
        document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

        document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
        document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--plt-clr-4');
        break;

      case 'oxford':
        document.documentElement.style.setProperty('--jz-palette-border', 'var(--plt-clr-1');
        document.documentElement.style.setProperty('--jz-palette-app-body', 'var(--plt-clr-1');
        document.documentElement.style.setProperty('--plt-txt-1', '#A6BFC9');
        document.documentElement.style.setProperty('--plt-txt-2', '#DCE6EF');
        document.documentElement.style.setProperty('--plt-txt-3', '#85A8C7');
        document.documentElement.style.setProperty('--plt-txt-4', '#85A8C7');
        document.documentElement.style.setProperty('--plt-txt-5', 'white');
        document.documentElement.style.setProperty('--jz-palette-color-text-light', '#f0f0ff');
        document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

        document.documentElement.style.setProperty('--jz-palette-color-0', '#496F5D');

        document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        document.documentElement.style.setProperty('--jz-palette-color-0', '#032130');

        document.documentElement.style.setProperty('--plt-clr-1', '#0A1128');
        document.documentElement.style.setProperty('--plt-clr-1-hi', '#05354C');
        document.documentElement.style.setProperty('--plt-clr-1-lo', '#031A26');

        document.documentElement.style.setProperty('--jz-palette-color-2', '#001f54');
        document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#0e4981');
        document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#092948');

        document.documentElement.style.setProperty('--plt-clr-3', '#034078');
        document.documentElement.style.setProperty('--plt-clr-3-hi', '#0988AE');
        document.documentElement.style.setProperty('--plt-clr-3-lo', '#0076A8854B61');

        document.documentElement.style.setProperty('--plt-clr-4', '#1282A2');
        document.documentElement.style.setProperty('--plt-clr-4-hi', '#93B2CD');
        document.documentElement.style.setProperty('--plt-clr-4-lo', '#779EC0');

        document.documentElement.style.setProperty('--plt-clr-5', '#fefcfb');
        document.documentElement.style.setProperty('--plt-clr-5-hi', '#D2D7C6');
        document.documentElement.style.setProperty('--plt-clr-5-lo', '#ACB597');

        document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
        document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
        document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

        document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
        document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
        document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
        document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
        document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
        document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
        document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

        document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
        document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--plt-clr-4');
        break;

      case "findash":

      case 'indigo2':
        document.documentElement.style.setProperty('--jz-palette-border', 'var(--plt-clr-3');
        document.documentElement.style.setProperty('--plt-txt-1', 'var(--plt-clr-3');
        document.documentElement.style.setProperty('--plt-txt-2', '#97A9BB');
        document.documentElement.style.setProperty('--plt-txt-3', 'black');
        document.documentElement.style.setProperty('--plt-txt-4', '#A9CEF4');
        document.documentElement.style.setProperty('--plt-txt-5', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-color-text-light', '#f0f0ff');
        document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

        document.documentElement.style.setProperty('--jz-palette-color-0', '#445469');

        document.documentElement.style.setProperty('--plt-clr-1', '#445469');
        document.documentElement.style.setProperty('--plt-clr-1-hi', '#0F4980');
        document.documentElement.style.setProperty('--plt-clr-1-lo', '#071F36');

        document.documentElement.style.setProperty('--jz-palette-color-2', '#2A3441');
        document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#323E4E');
        document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#222A34');

        document.documentElement.style.setProperty('--plt-clr-3', 'black');
        document.documentElement.style.setProperty('--plt-clr-3-hi', '#81C5DA');
        document.documentElement.style.setProperty('--plt-clr-3-lo', '#51B0CD');

        document.documentElement.style.setProperty('--plt-clr-4', '#A9CEF4');
        document.documentElement.style.setProperty('--plt-clr-4-hi', '#A0ADBA');
        document.documentElement.style.setProperty('--plt-clr-4-lo', '#8998A9');

        document.documentElement.style.setProperty('--plt-clr-5', '#DCE6EF');
        document.documentElement.style.setProperty('--plt-clr-5-hi', '#D2D7C6');
        document.documentElement.style.setProperty('--plt-clr-5-lo', '#ACB597');

        document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
        document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
        document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

        document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
        document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
        document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
        document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
        document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
        document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
        document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

        document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
        document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--plt-clr-4');

        document.documentElement.style.setProperty('--popup-color-1', '#445469');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');
        break;



      case 'red':
        document.documentElement.style.setProperty('--jz-palette-border', 'var(--plt-clr-3)');
        document.documentElement.style.setProperty('--plt-txt-1', 'skyblue');
        document.documentElement.style.setProperty('--plt-txt-2', '#0C3A64');
        document.documentElement.style.setProperty('--plt-txt-3', 'black');
        document.documentElement.style.setProperty('--plt-txt-4', '#0DBDF2');
        document.documentElement.style.setProperty('--plt-txt-5', '#9DB9D2');
        document.documentElement.style.setProperty('--jz-palette-color-text-light', '#f0f0ff');
        document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

        document.documentElement.style.setProperty('--jz-palette-color-0', '#861B2D');

        document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        document.documentElement.style.setProperty('--plt-clr-1', '#320101');
        document.documentElement.style.setProperty('--plt-clr-1-hi', '#0D3F6D');
        document.documentElement.style.setProperty('--plt-clr-1-lo', '#092A49');

        document.documentElement.style.setProperty('--jz-palette-color-2', '#A71D31');
        document.documentElement.style.setProperty('--jz-palette-color-2-hi', '##08799B');
        document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#065B74');

        document.documentElement.style.setProperty('--plt-clr-3', '#7D0404');
        document.documentElement.style.setProperty('--plt-clr-3-hi', '#96D5ED');
        document.documentElement.style.setProperty('--plt-clr-3-lo', '#73C7E7');

        document.documentElement.style.setProperty('--plt-clr-4', '#BD0404');
        document.documentElement.style.setProperty('--plt-clr-4-hi', '#A0ADBA');
        document.documentElement.style.setProperty('--plt-clr-4-lo', '#8998A9');

        document.documentElement.style.setProperty('--plt-clr-5', '#F00202');
        document.documentElement.style.setProperty('--plt-clr-5-hi', '#D2D7C6');
        document.documentElement.style.setProperty('--plt-clr-5-lo', '#ACB597');

        document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
        document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
        document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

        document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
        document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
        document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
        document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
        document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
        document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
        document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

        document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
        document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--plt-clr-4');
        break;



      case 'coffee':
        document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        document.documentElement.style.setProperty('--jz-palette-color-0', '#2A0800');

        document.documentElement.style.setProperty('--plt-clr-1', '#2A0800');
        document.documentElement.style.setProperty('--plt-clr-1-hi', '#3E4C38');
        document.documentElement.style.setProperty('--plt-clr-1-lo', '#181D16');

        document.documentElement.style.setProperty('--jz-palette-color-2', '#754F43');
        document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#82584A');
        document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#68473C');

        document.documentElement.style.setProperty('--plt-clr-3', '#C09891');
        document.documentElement.style.setProperty('--plt-clr-3-hi', '#0A97C2');
        document.documentElement.style.setProperty('--plt-clr-3-lo', '#065B74');

        document.documentElement.style.setProperty('--plt-clr-4', '#BEA8A7');
        document.documentElement.style.setProperty('--plt-clr-4-hi', '#A0ADBA');
        document.documentElement.style.setProperty('--plt-clr-4-lo', '#8998A9');

        document.documentElement.style.setProperty('--plt-clr-5', '#F4DBD8');
        document.documentElement.style.setProperty('--plt-clr-5-hi', '#D2D7C6');
        document.documentElement.style.setProperty('--plt-clr-5-lo', '#ACB597');

        document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
        document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
        document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

        document.documentElement.style.setProperty('--jz-palette-color-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-color-text-light', '#ffffff');
        document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

        document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
        document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
        document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
        document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
        document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
        document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
        document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

        document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
        document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--plt-clr-4');
        break;

      case 'jungle':
        document.documentElement.style.setProperty('--popup-color-1', '#496F5D');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        document.documentElement.style.setProperty('--jz-palette-color-0', '#111815');

        document.documentElement.style.setProperty('--plt-clr-1', '#111815');
        document.documentElement.style.setProperty('--plt-clr-1-hi', '#3E4C38');
        document.documentElement.style.setProperty('--plt-clr-1-lo', '#181D16');

        document.documentElement.style.setProperty('--jz-palette-color-2', '#24322D');
        document.documentElement.style.setProperty('--jz-palette-color-2-hi', '#82584A');
        document.documentElement.style.setProperty('--jz-palette-color-2-lo', '#68473C');

        document.documentElement.style.setProperty('--plt-clr-3', '#3B5249');
        document.documentElement.style.setProperty('--plt-clr-3-hi', '#0A97C2');
        document.documentElement.style.setProperty('--plt-clr-3-lo', '#065B74');

        document.documentElement.style.setProperty('--plt-clr-4', '#4EA699');
        document.documentElement.style.setProperty('--plt-clr-4-hi', '#A0ADBA');
        document.documentElement.style.setProperty('--plt-clr-4-lo', '#8998A9');

        document.documentElement.style.setProperty('--plt-clr-5', '#D2D7C6');
        document.documentElement.style.setProperty('--plt-clr-5-hi', '#D2D7C6');
        document.documentElement.style.setProperty('--plt-clr-5-lo', '#ACB597');

        document.documentElement.style.setProperty('--jz-palette-color-view', '#000000');
        document.documentElement.style.setProperty('--jz-palette-color-attention', '#ABE188');
        document.documentElement.style.setProperty('--jz-palette-color-attention-text', '#ABE188');

        document.documentElement.style.setProperty('--jz-palette-color-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-color-text-light', '#ffffff');
        document.documentElement.style.setProperty('--jz-palette-color-text-dark', '#000000');

        document.documentElement.style.setProperty('--jz-palette-button', '#0C3A64');
        document.documentElement.style.setProperty('--jz-palette-button-hi', '#104F89');
        document.documentElement.style.setProperty('--jz-palette-button-lo', '#072540');
        document.documentElement.style.setProperty('--jz-palette-button-text', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-button2', '#08799B');
        document.documentElement.style.setProperty('--jz-palette-button2-hi', '#0A97C2');
        document.documentElement.style.setProperty('--jz-palette-button2-lo', '#065B74');
        document.documentElement.style.setProperty('--jz-palette-button2-text', '#000000');

        document.documentElement.style.setProperty('--jz-palette-grid-row-alternate', '#0D3F6E');
        document.documentElement.style.setProperty('--jz-palette-grid-text-light', '#DCE6EF');
        document.documentElement.style.setProperty('--jz-palette-grid-text-dark', 'var(--plt-clr-4');
        break;



      default:
    }
  }
}
