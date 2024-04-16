
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChoroDataService {

  private apiBaseUrl = 'https://localhost:7105/api/jazdb'; // Adjust with your actual API URL

  electionDataDictionary: { [fips: string]: any } = {}; 
  populationDataDictionary: { [fips: string]: any } = {};

  isElectionDataFetched = false;
  isPopulationDataFetched = false;

  constructor(private http: HttpClient) { }

  getElectionData(popover_loading: any, popover_httperror: any): Observable<any> {
    if (this.isElectionDataFetched) {
      // If the data is already fetched, return it as an Observable
      return of(this.electionDataDictionary);
    } else {
      // If the data is not yet fetched, fetch it from the server
      popover_loading.isPopupVisible = true;
      popover_loading.url = 'https://localhost:5114/api/jazdb/election-api';
      popover_loading.data = 'Election';

      return this.http.get<any>(`${this.apiBaseUrl}/election-api`).pipe(
        tap(responseData => {
          this.processElectionData(responseData);
          this.isElectionDataFetched = true;
          popover_loading.isPopupVisible = false;
        }),
        catchError((error: HttpErrorResponse) => {
          // popover_loading.isPopupVisible = false;
          popover_httperror.ok = error.ok;
          popover_httperror.message = error.message;
          popover_httperror.url = error.url;
          popover_httperror.statusText = error.statusText;
          popover_httperror.isPopupVisible = true;
          console.error('Error fetching data:', error);
          // Handle the error appropriately
          return throwError(error);
        })
      );
    }
  }

  getPopulationData(popover_loading: any, popover_httperror: any): Observable<any> {
    if (this.isPopulationDataFetched) {
      // If the data is already fetched, return it as an Observable
      return of(this.populationDataDictionary);
    } else {
      // If the data is not yet fetched, fetch it from the server
      popover_loading.isPopupVisible = true;
      popover_loading.url = 'https://localhost:5114/api/jazdb/population';
      popover_loading.data = 'Population';

      return this.http.get<any>(`${this.apiBaseUrl}/population-api`).pipe(
        tap(responseData => {
          this.processPopulationData(responseData);
          this.isPopulationDataFetched = true;
          popover_loading.isPopupVisible = false;
        }),
        catchError((error: HttpErrorResponse) => {
          popover_httperror.ok = error.ok;
          popover_httperror.message = error.message;
          popover_httperror.url = error.url;
          popover_httperror.statusText = error.statusText;
          popover_loading.isPopupVisible = false;
          popover_httperror.isPopupVisible = true;
        
          console.error('Error fetching data:', error);
          // Handle the error appropriately
          return throwError(error);
        })
      );
    }
  }

  processPopulationData(responseData: any[]): void {
    this.populationDataDictionary = responseData.reduce((acc, curr) => {
      /*  console.log('Current item FIPS:', curr.fips); // Log the FIPS code of the current item*/
      if (curr.fips) {
        acc[curr.fips] = curr;
      } else {
        console.warn('Undefined FIPS code found', curr); // Log warning if FIPS code is undefined
      }
      return acc;
    }, {});
    //  console.log('Processed election data dictionary:', this.electionDataDictionary);
  }

  GetPopulationData() {
    const results = this.http.get<any>(`${this.apiBaseUrl}/population`);
    return results;
  }

  processElectionData(responseData: any[]): void {
    this.electionDataDictionary = responseData.reduce((acc, curr) => {
   
      if (curr.countyFips) {
        acc[curr.countyFips] = curr;
      } else {
        console.warn('Undefined FIPS code found', curr); // Log warning if FIPS code is undefined
      }
      return acc;
    }, {});
  //  console.log('Processed election data dictionary:', this.electionDataDictionary);
  }
}
