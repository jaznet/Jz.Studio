import { Inject, Injectable } from '@angular/core';

import { CountyLayerRenderer } from '../models/county-layer-renderer.model';
import { CountySelectionHighlighter } from '../models/county-selection-highlighter.model';
import { UsaLayerFactory } from '../models/factories/usa-layer-factory.model';
import { StateCentroidRenderer } from '../models/state-centroid-renderer.model';
import {
  UsaRenderHandle,
  UsaRenderOptions,
  UsaRenderer
} from '../models/usa-renderer.model';
import { UsaBoundaryRenderer } from '../models/usa-boundary-renderer.model';
import { COUNTY_LAYER_RENDERER } from './county-layer-renderer.token';
import { COUNTY_SELECTION_HIGHLIGHTER } from './county-selection-highlighter.token';
import { STATE_CENTROID_RENDERER } from './state-centroid-renderer.token';
import { StateLabelRendererService } from './state-label-renderer.service';
import { USA_BOUNDARY_RENDERER } from './usa-boundary-renderer.token';
import { USA_LAYER_FACTORY } from './factories/usa-layer-factory.token';
import { UsaViewportFitterService } from './usa-viewport-fitter.service';

@Injectable({
  providedIn: 'root'
})
export class UsaRendererFacadeService implements UsaRenderer {

  constructor(
    @Inject(COUNTY_LAYER_RENDERER)
    private countyLayerRenderer: CountyLayerRenderer,
    @Inject(COUNTY_SELECTION_HIGHLIGHTER)
    private countySelectionHighlighter: CountySelectionHighlighter,
    @Inject(STATE_CENTROID_RENDERER)
    private stateCentroidRenderer: StateCentroidRenderer,
    private stateLabelRenderer: StateLabelRendererService,
    @Inject(USA_BOUNDARY_RENDERER)
    private usaBoundaryRenderer: UsaBoundaryRenderer,
    @Inject(USA_LAYER_FACTORY)
    private usaLayerFactory: UsaLayerFactory,
    private usaViewportFitter: UsaViewportFitterService
  ) { }

  render(options: UsaRenderOptions): UsaRenderHandle {
    const layers = this.usaLayerFactory.create(
      options.host,
      options.width,
      options.height
    );

    this.countyLayerRenderer.render({
      countyLayer: layers.countyLayer,
      countyFeaturesCollection: options.countyFeaturesCollection,
      pathClass: 'choro-county-path',
      gesture: 'click',
      onCountySelected: options.onCountySelected,
      includeTitle: true
    });

    this.usaBoundaryRenderer.render(
      layers.stateLayer,
      layers.nationLayer,
      options.stateFeaturesCollection,
      options.stateMesh,
      options.nationMesh
    );
    this.stateLabelRenderer.render(
      layers.stateTextLayer,
      options.stateFeaturesCollection
    );
    this.stateCentroidRenderer.render(
      layers.usaLayer,
      options.stateFeaturesCollection
    );

    const handle: UsaRenderHandle = {
      resize: (width, height) => {
        layers.svg.attr('viewBox', `0 0 ${width} ${height}`);
        this.usaViewportFitter.fit(layers.usaLayer, width, height);
      },
      applyCountySelection: selectedCountyId =>
        this.countySelectionHighlighter.apply(
          layers.countyLayer,
          'path.choro-county-path',
          selectedCountyId
        ),
      applyCentroidPresentation: (showCentroids, centroidMode) =>
        this.stateCentroidRenderer.applyDisplay(
          layers.usaLayer,
          showCentroids,
          centroidMode
        )
    };

    handle.applyCentroidPresentation(
      options.showCentroids,
      options.centroidMode
    );
    handle.applyCountySelection(options.selectedCountyId);
    handle.resize(options.width, options.height);

    return handle;
  }
}
