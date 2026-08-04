import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { FederalElection } from '../models/federal-election';
import { Population } from '../models/population';

@Injectable({
  providedIn: 'root'
})
export class ChoroDataService {
  private apiBaseUrl = 'https://localhost:7105/api/jazdb';

  popover_loading: any;
  popover_httperror: any;

  populationDataDictionary: { [fips: string]: Population } = {};
  electionDataDictionary: { [countyFips: string]: FederalElection } = {};

  isElectionDataFetched = false;
  isPopulationDataFetched = false;

  constructor(private http: HttpClient) {
  }

  getElectionData(): Observable<FederalElection[]> {
    if (this.isElectionDataFetched) {
      return of(Object.values(this.electionDataDictionary));
    }

    this.popover_loading.isPopupVisible = true;
    this.popover_loading.url = `${this.apiBaseUrl}/election-api`;
    this.popover_loading.data = 'Election';

    return this.http.get<FederalElection[]>(
      `${this.apiBaseUrl}/election-api`
    ).pipe(
      map((responseData: FederalElection[]) => {
        this.buildElectionDictionary(responseData);
        this.isElectionDataFetched = true;
        this.popover_loading.isPopupVisible = false;

        return responseData;
      }),
      catchError((error: HttpErrorResponse) => {
        this.popover_httperror.ok = error.ok;
        this.popover_httperror.message = error.message;
        this.popover_httperror.url = error.url;
        this.popover_httperror.statusText = error.statusText;
        this.popover_httperror.isPopupVisible = true;

        console.error('Error fetching data:', error);

        return throwError(() => error);
      })
    );
  }

  buildElectionDictionary(elections: FederalElection[]): void {
    this.electionDataDictionary =
      elections.reduce<{ [key: string]: FederalElection }>(
        (acc, election) => {
          const fips = election.countyFips;

          if (fips) {
            acc[fips] = election;
          } else {
            console.warn(
              'Undefined countyFips found in election data:',
              election
            );
          }

          return acc;
        },
        {}
      );
  }

  getPopulationData(): Observable<Population[]> {
    if (this.isPopulationDataFetched) {
      return of(Object.values(this.populationDataDictionary));
    }

    return this.http.get<Population[]>(
      `${this.apiBaseUrl}/population-api`
    ).pipe(
      map((responseData: Population[]) => {
        this.buildPopulationDictionary(responseData);
        this.isPopulationDataFetched = true;

        return responseData;
      })
    );
  }

  buildPopulationDictionary(populations: Population[]): void {
    this.populationDataDictionary =
      populations.reduce<{ [key: string]: Population }>(
        (acc, population) => {
          if (population.fips) {
            acc[population.fips] = population;
          } else {
            console.warn(
              'Undefined FIPS code found in population data:',
              population
            );
          }

          return acc;
        },
        {}
      );
  }
}
