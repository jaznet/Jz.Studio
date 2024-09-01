
import { Component, HostBinding } from '@angular/core';
import { PaletteMgrService } from '../../../../app/app-services/palette-mgr.service';

@Component({
  selector: 'dataviz-home',
  templateUrl: './dataviz-home.component.html',
  styleUrl: './dataviz-home.component.css'
})
export class DatavizHomeComponent {
  @HostBinding('class') classes = 'fit-to-parent';

  constructor(private palette: PaletteMgrService) {
    palette.ChangePalette('gold');
  }
}
