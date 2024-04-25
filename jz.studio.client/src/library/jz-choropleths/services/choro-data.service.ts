import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Population } from '../../../models/Population';
import { FederalElection } from '../models/FederalElection';

@Injectable({
  providedIn: 'root'
})
export class ChoroDataService {
  private apiBaseUrl = 'https://localhost:7105/api/jazdb'; // Adjust with your actual API URL

  
  populationDataDictionary: { [fips: string]: Population } = {};
  isElectionDataFetched = false;
  isPopulationDataFetched = false;

  constructor(private http: HttpClient) { }

  getElectionData(popover_loading: any, popover_httperror: any): Observable<FederalElection[]> {
    if (this.isElectionDataFetched) {
      return of(Object.values(this.electionDataDictionary));
    } else {
      popover_loading.isPopupVisible = true;
      popover_loading.url = `${this.apiBaseUrl}/election-api`;
      popover_loading.data = 'Election';

      return this.http.get<FederalElection[]>(`${this.apiBaseUrl}/election-api`).pipe(
        map((responseData: FederalElection[]) => {
          this.buildElectionDictionary(responseData);
          this.isElectionDataFetched = true;
          popover_loading.isPopupVisible = false;
          return responseData;
        }),
        catchError((error: HttpErrorResponse) => {
          popover_httperror.ok = error.ok;
          popover_httperror.message = error.message;
          popover_httperror.url = error.url;
          popover_httperror.statusText = error.statusText;
          popover_httperror.isPopupVisible = true;
          console.error('Error fetching data:', error);
          return throwError(error);
        })
      );
    }
  }

  electionDataDictionary: { [countyFips: string]: FederalElection } = {};
  buildElectionDictionary(elections: FederalElection[]): void {
    this.electionDataDictionary = elections.reduce<{ [key: string]: FederalElection }>((acc, election) => {
      let fips = election.stateFips + election.countyFips!;
      if (fips) {
        acc[fips] = election;
      } else {
        console.warn('Undefined countyFips found in election data:', election);
      }
      return acc;
    }, {});
  }

  getPopulationData(popover_loading: any, popover_httperror: any): Observable<Population[]> {
    if (this.isPopulationDataFetched) {
      return of(Object.values(this.populationDataDictionary));
    } else {
      popover_loading.isPopupVisible = true;
      popover_loading.url = `${this.apiBaseUrl}/population-api`;
      popover_loading.data = 'Population';

      return this.http.get<Population[]>(`${this.apiBaseUrl}/population-api`).pipe(
        map(responseData => {
          this.buildPopulationDictionary(responseData);
          this.isPopulationDataFetched = true;
          popover_loading.isPopupVisible = false;
          return responseData;
        }),
        catchError((error: HttpErrorResponse) => {
          popover_httperror.ok = error.ok;
          popover_httperror.message = error.message;
          popover_httperror.url = error.url;
          popover_httperror.statusText = error.statusText;
          popover_httperror.isPopupVisible = true;
          console.error('Error fetching data:', error);
          return throwError(error);
        })
      );
    }
  }

  buildPopulationDictionary(populations: Population[]): void {
    this.populationDataDictionary = populations.reduce<{ [key: string]: Population }>((acc, population) => {
      if (population.fips) {
        acc[population.fips] = population;
      } else {
        console.warn('Undefined FIPS code found in population data:', population);
      }
      return acc;
    }, {});
  }

}
