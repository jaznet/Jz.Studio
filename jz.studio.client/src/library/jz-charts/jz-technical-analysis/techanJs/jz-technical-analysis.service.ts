import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockPriceHistory } from '../../../../models/stock-price-history.model';

@Injectable({
  providedIn: 'root'
})
export class JzTechnicalAnalysisService {

  private apiUrl = 'https://localhost:7105/api/JazDb/stock-prices-api';  // Update with your API URL

  constructor(private http: HttpClient) { }

  getStockPrices(ticker: string): Observable<StockPriceHistory[]> {
    return this.http.get<StockPriceHistory[]>(`${this.apiUrl}/${ticker}`);
  }
}
