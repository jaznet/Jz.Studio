
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountyDataService {
  private countyDataSubject = new BehaviorSubject<any>(null);

  sendCountyData(data: any) {
    this.countyDataSubject.next(data);
  }

  getCountyDataObservable(): Observable<any> {
    return this.countyDataSubject.asObservable();
  }
}
