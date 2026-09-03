import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'jz-studio-logo',
  standalone: true,
  templateUrl: './jz-studio-logo.component.html',
  styleUrl: './jz-studio-logo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JzStudioLogoComponent { }
