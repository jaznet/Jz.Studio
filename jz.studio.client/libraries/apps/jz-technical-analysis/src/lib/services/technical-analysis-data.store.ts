import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  EMPTY_TECHNICAL_ANALYSIS_DATA,
  TechnicalAnalysisDataModel
} from '../models/technical-analysis-data.model';

@Injectable({ providedIn: 'root' })
export class TechnicalAnalysisDataStore {
  private readonly modelSubject =
    new BehaviorSubject<TechnicalAnalysisDataModel>(
      EMPTY_TECHNICAL_ANALYSIS_DATA
    );

  readonly model$: Observable<TechnicalAnalysisDataModel> =
    this.modelSubject.asObservable();

  get model(): TechnicalAnalysisDataModel {
    return this.modelSubject.value;
  }

  set(model: TechnicalAnalysisDataModel): void {
    this.modelSubject.next(model);
  }
}
