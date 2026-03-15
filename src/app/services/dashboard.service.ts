import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Dashboard } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'api/Dashboard';

  constructor(private http: HttpClient) {}

  getDados(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.apiUrl}/${this.endpoint}`);
  }
}

