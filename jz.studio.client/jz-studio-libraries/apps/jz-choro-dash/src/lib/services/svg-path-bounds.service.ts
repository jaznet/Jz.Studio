import { Injectable } from '@angular/core';

export interface SvgBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class SvgPathBoundsService {

  measure(
    svgNode: SVGSVGElement | null,
    graphicsNode: SVGGraphicsElement
  ): SvgBounds | null {
    if (!svgNode) {
      return null;
    }

    const svgScreenMatrix = svgNode.getScreenCTM();

    if (!svgScreenMatrix) {
      return null;
    }

    const inverseSvgScreenMatrix = svgScreenMatrix.inverse();
    const paths = Array.from(
      graphicsNode.querySelectorAll<SVGPathElement>('path')
    );

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    paths.forEach(pathNode => {
      const pathScreenMatrix = pathNode.getScreenCTM();

      if (!pathScreenMatrix) {
        return;
      }

      const pathLength = pathNode.getTotalLength();
      const sampleCount = Math.max(
        2,
        Math.min(4096, Math.ceil(pathLength))
      );

      for (let index = 0; index <= sampleCount; index += 1) {
        const pathPoint = pathNode.getPointAtLength(
          pathLength * index / sampleCount
        );
        const screenPoint = pathPoint.matrixTransform(pathScreenMatrix);
        const svgPoint = screenPoint.matrixTransform(inverseSvgScreenMatrix);

        minX = Math.min(minX, svgPoint.x);
        minY = Math.min(minY, svgPoint.y);
        maxX = Math.max(maxX, svgPoint.x);
        maxY = Math.max(maxY, svgPoint.y);
      }
    });

    if (
      !Number.isFinite(minX) ||
      !Number.isFinite(minY) ||
      !Number.isFinite(maxX) ||
      !Number.isFinite(maxY)
    ) {
      return null;
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
}
