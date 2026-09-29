import { Inject, Injectable } from '@angular/core';

import { CountyLayerSelection } from '../models/county-layer-factory.model';
import { CountySelectionHighlighter } from '../models/county-selection-highlighter.model';
import { StateViewportFitter } from '../models/state-viewport-fitter.model';
import {
  StateRenderHandle,
  StateRenderer,
  StateRenderOptions
} from '../models/state-renderer.model';
import { COUNTY_SELECTION_HIGHLIGHTER } from './county-selection-highlighter.token';
import { StateLayerRendererService } from './state-layer-renderer.service';
import { StateTitleRendererService } from './state-title-renderer.service';
import { STATE_VIEWPORT_FITTER } from './state-viewport-fitter.token';

@Injectable({
  providedIn: 'root'
})
export class StateRendererFacadeService implements StateRenderer {

  constructor(
    @Inject(COUNTY_SELECTION_HIGHLIGHTER)
    private countySelectionHighlighter: CountySelectionHighlighter,
    private stateLayerRenderer: StateLayerRendererService,
    private stateTitleRenderer: StateTitleRendererService,
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
