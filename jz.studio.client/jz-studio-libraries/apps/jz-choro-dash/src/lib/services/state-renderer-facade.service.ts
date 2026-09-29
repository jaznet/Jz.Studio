import { Inject, Injectable } from '@angular/core';

import { CountyLayerSelection } from '../models/factories/county-layer-factory.model';
import { CountySelectionHighlighter } from '../models/county-selection-highlighter.model';
import { StateLayerRenderer } from '../models/state-layer-renderer.model';
import { StateTitleRenderer } from '../models/state-title-renderer.model';
import { StateViewportFitter } from '../models/state-viewport-fitter.model';
import {
  StateRenderHandle,
  StateRenderer,
  StateRenderOptions
} from '../models/state-renderer.model';
import { COUNTY_SELECTION_HIGHLIGHTER } from './county-selection-highlighter.token';
import { STATE_LAYER_RENDERER } from './state-layer-renderer.token';
import { STATE_TITLE_RENDERER } from './state-title-renderer.token';
import { STATE_VIEWPORT_FITTER } from './state-viewport-fitter.token';

@Injectable({
  providedIn: 'root'
})
export class StateRendererFacadeService implements StateRenderer {

  constructor(
    @Inject(COUNTY_SELECTION_HIGHLIGHTER)
    private countySelectionHighlighter: CountySelectionHighlighter,
    @Inject(STATE_LAYER_RENDERER)
    private stateLayerRenderer: StateLayerRenderer,
    @Inject(STATE_TITLE_RENDERER)
    private stateTitleRenderer: StateTitleRenderer,
    @Inject(STATE_VIEWPORT_FITTER)
    private stateViewportFitter: StateViewportFitter
  ) { }

  render(options: StateRenderOptions): StateRenderHandle | null {
    const layers = this.stateLayerRenderer.render({
      host: options.host,
      width: options.width,
      height: options.height,
      shapeSet: options.shapeSet,
      onCountySelected: options.onCountySelected
    });

    this.applyCountySelection(
      layers.countyLayer,
      options.selectedCountyId
    );

    if (!layers.countyLayer.node()) {
      return null;
    }

    this.stateViewportFitter.fit({
      svg: layers.svg,
      outerGroup: layers.outerGroup,
      stateGroup: layers.stateLayer,
      stateId: options.stateId,
      width: options.width,
      height: options.height
    });

    this.stateTitleRenderer.render(
      layers.titleLayer,
      options.stateId,
      options.width
    );

    return {
      applyCountySelection: selectedCountyId =>
        this.applyCountySelection(
          layers.countyLayer,
          selectedCountyId
        )
    };
  }

  private applyCountySelection(
    countyLayer: CountyLayerSelection,
    selectedCountyId: string | null
  ): void {
    this.countySelectionHighlighter.apply(
      countyLayer,
      'path.state-county-path',
      selectedCountyId
    );
  }
}
