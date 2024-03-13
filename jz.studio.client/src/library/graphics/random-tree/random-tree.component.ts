import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import * as d3Selection from 'd3-selection';
import * as d3Hierarchy from 'd3-hierarchy';
import * as d3Shape from 'd3-shape';
import * as d3 from 'd3';

@Component({
  selector: 'random-tree',
  templateUrl: './random-tree.component.html',
  styleUrls: ['./random-tree.component.css']
})
export class RandomTreeComponent implements OnInit {
  @HostBinding('class') classes = 'fit-to-parent';
  @ViewChild('svgContainer', { static: true }) svgContainerRef!: ElementRef;

  svgCxntainer!: any;
  svgWidth: number = 0;
  svgHeight: number = 0;

  dxlistitems: string[] = [];

  constructor() {
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    const svg: any = this.svgContainerRef.nativeElement;
    this.svgCxntainer = this.svgContainerRef.nativeElement;
    this.svgWidth = svg.clientWidth - 70;
    this.svgHeight = this.svgCxntainer.clientHeight - 50;
    this.createTree();
  }

  createTree() {
    const viewport = " 0 0 " + this.svgWidth + " " + this.svgHeight;
    const svg = d3Selection.select(this.svgCxntainer)
      .append("svg")
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', viewport);
    const treeLayout = d3Hierarchy.tree().size([this.svgWidth - 10, this.svgHeight - 20]);
    const treeNode = d3Hierarchy.hierarchy.prototype.constructor;
    const root: any = new treeNode();
    root.name = '0';
    const nodes: any = [root];
    const links: Array<{ source: any; target: any; }> = [];
    const duration = 1000;
    this.dxlistitems.push('root : (' + nodes.length + ') ' + links.length + root.depth);

    treeLayout(root);

    let linkGroup = svg.append("g")
      .attr('class', 'linksGroup')
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .selectAll<SVGPathElement, d3Shape.DefaultLinkObject>(".link");

    let nodeGroup = svg.append("g")
      .attr('class', 'nodesGroup')
      .attr('fill', 'black')
      .attr("stroke", "black")
      // .attr("stroke-width", 1)
      .selectAll<SVGCircleElement, SVGGElement>(".node");

    let textGroup = svg.append("g")
      .attr('class', 'textGroup')
      .attr("stroke", "#406B6B")
      .attr("stroke-width", ".5")
      .attr("font-size", "9px")
      .attr('y', '2')
      .style("font-weight", "100")
      .selectAll<SVGTextElement, SVGGElement>('g');

    const interval = d3.interval(() => {

      if (nodes.length >= 48) return interval.stop();

      // Add a new child node to a random parent.
      const i = Math.floor(Math.random() * nodes.length);
      //const parent: d3Node.Node = nodes[i];
      //const child: d3Node.Node = new treeNode();
      const parent: any = nodes[i];
      const child: any = new treeNode();
      child.name = nodes.length;
      child.parent = parent;
      child.depth = parent.depth + 1;

      if (parent.children)
        parent.children.push(child);
      else
        parent.children = [child];

      nodes.push(child);

      treeLayout(root);
      links.push({ source: nodes[i], target: nodes[nodes.length - 1] });

      // console.log('child', nodes.length, '[', i, ']', child.depth, parent.depth);
      this.dxlistitems.push('child: (' + nodes.length + ') ' + ' [' + i + ']' + parent.depth + child.depth);
      nodes.forEach((n: any, index: any) => {
        let parentdepth = 'x';
        if (n.parent) { parentdepth = n.parent.depth; }
        this.dxlistitems.push(nodes.length + ' [' + i + '] ' + parentdepth + '/' + n.depth + '[' + n.x + ', ' + n.y + ']');
        //   console.log('%cnode: ', 'color:lightblue', index, n.x, n.y);
      });

      linkGroup = linkGroup.data(links);
      const linkEnter = linkGroup
        .enter();
      linkEnter.selectAll('.linkPath').remove();
      linkEnter.append('g')
        .attr('class', 'linkPath')
        .style('stroke', 'black')
        .insert('path', '.node')

        .attr('class', 'link')
        /* .attr('d', this.renderLink)*/
        /*.attr('d', (d: d3Node.Node) => {*/
        .attr('d', (d: any) => {
          const x1 = d.source.x;
          const y1 = d.source.y;
          const x2 = d.target.x;
          const y2 = d.target.y;
          return this.renderLink({ source: [x1, y1], target: [x2, y2] });
        })
        ;

      nodeGroup = nodeGroup.data(nodes);

      const nodeEnter = nodeGroup
        .enter();
      nodeEnter.selectAll('circle').remove();
      nodeEnter.append('circle')
        .attr("class", "node")
        .attr("r", 8)
        .attr('name', nodes.length)
        .attr('fill','black')
        .attr('depth', (d: any) => {
         // console.log(d);
          return d.depth;
        })
        .attr('cx', (d: any) => {
          return d.x;
        })
        .attr('cy', (d: any) => {
          return d.y;
        })
        ;

      //nodeEnter.append('circle')
      //  .attr("class", "node")
      //  .attr("r", 8)
      //  .attr('name', nodes.length)
      //  .attr('fill', '#ffffff30')
      //  .attr('depth', (d: any) => {
      //    // console.log(d);
      //    return d.depth;
      //  })
      //  .attr('cx', (d: any) => {
      //    return d.x;
      //  })
      //  .attr('cy', (d: any) => {
      //    return d.y;
      //  })
      //  ;

      textGroup = textGroup.data(nodes);
      textGroup.exit().remove();

      const textEnter = textGroup
        .enter();
      textEnter.selectAll('text').remove();
      textEnter.append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('stroke', 'none')
        .attr('stroke-width', '0.5')
        .attr('fill', '#9EC3C3')
        .attr('font-weight', '100')
        .attr('x', (d: any) => {
          return d.x;
        })
        .attr('y', (d: any) => {
          return d.y + .5;
        })
        .text(function (d: any) {
          return d.name;
        })

        ;

    }, duration);
  }

  renderLink = d3.linkVertical().x((d: any) => {
    return d[0];
  }).y((d: any) => {
    return d[1];
  });

}
