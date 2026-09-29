export interface SvgBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SvgPathBoundsMeasurer {
  measure(
    svgNode: SVGSVGElement | null,
    graphicsNode: SVGGraphicsElement
  ): SvgBounds | null;
}
