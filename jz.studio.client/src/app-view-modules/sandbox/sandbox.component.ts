import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent {
  @HostBinding('class') classes = 'fit-to-parent ';
  contructor() {
    console.log('SandboxAppComponent');
  }
}
