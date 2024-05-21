import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef, AfterContentInit, HostBinding } from '@angular/core';
import { DxSankeyComponent } from 'devextreme-angular/ui/sankey';
import { SankeyService, DataItem } from './jz-sankey.service';

@Component({
  selector: 'jz-sankey',
  templateUrl: './jz-sankey.component.html',
  styleUrls: ['./jz-sankey.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class SankeyComponent implements OnInit, AfterContentInit, AfterViewInit {

  @HostBinding('class') classes = 'fit-to-parent';

  @ViewChild(DxSankeyComponent, { static: false }) sankey: DxSankeyComponent | undefined;

  service: SankeyService;
  data: DataItem[] = [];
  height: any;
  width: any;
  host: HTMLElement | undefined;
  sankeyNodes: Array<any> | undefined;
  sankeyLinks: Array<any> | undefined;
  nodeColors: Array<string> = [];

  constructor(
    private elementRef: ElementRef,
    service: SankeyService,
    private changeDetector: ChangeDetectorRef) {
    this.service = service;
  }

  ngOnInit() { }

  ngAfterContentInit(): void {  }

  ngAfterViewInit(): void {
    this.host = this.elementRef!.nativeElement.parentElement;
    this.width = this.elementRef!.nativeElement.parentElement.clientWidth;
    this.height = this.elementRef!.nativeElement.parentElement.clientHeight;
    this.data = this.service.getData();
    this.changeDetector.detectChanges();
  }

  isDrawn(event:any) {
    this.sankeyLinks = this.sankey!.instance.getAllLinks();
    this.sankeyNodes = this.sankey!.instance.getAllNodes();
    if (this.sankeyNodes.length > 0) {                
      this.sankeyNodes.forEach((sankeyNode: any) => {
        const color: string = this.service.GetColor(sankeyNode.title);
        this.nodeColors?.push(color);
       
        //if (sankeyNode.title === 'Thermal Generation') {
        //  this.nodeColors?.push('red');
        //} else {
        //  this.nodeColors?.push('white');
        //}
       
      });
      this.sankey?.instance.render();
    }
  }

  doit: any;
  onResize(event: { target: { innerWidth: any; }; }) {
    //event.target.innerWidth; // window width
    console.log('resize', event.target.innerWidth);
    clearTimeout(this.doit);
    this.doit = setTimeout(this.resize, 300);
  }

  resize() {
    console.log('%ctime to resize', 'color:yellow');
  }

}
