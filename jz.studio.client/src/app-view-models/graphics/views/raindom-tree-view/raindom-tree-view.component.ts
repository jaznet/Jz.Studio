import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'raindom-tree-view',
  templateUrl: './raindom-tree-view.component.html',
  styleUrl: './raindom-tree-view.component.css'
})
export class RaindomTreeViewComponent implements OnInit {
  @HostBinding('class') classes = 'fit-to-parent ';

  constructor() { }
    ngOnInit(): void {
        
    }
}
