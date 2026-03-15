import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ca, CaRequest } from '../models/ca.model';
import { PagedListDto } from '../models/page-request.model';
import { ResponseDto } from '../models/response-dto.model';

@Injectable({
  providedIn: 'root'
})
export class CaService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'api/Ca';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ca[]> {
    return this.http.get<Ca[]>(`${this.apiUrl}/${this.endpoint}`);
  }

  getById(id: number): Observable<ResponseDto<Ca>> {
    return this.http.get<ResponseDto<Ca>>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  create(ca: Ca): Observable<Ca> {
    return this.http.post<Ca>(`${this.apiUrl}/${this.endpoint}`, ca);
  }

  update(id: number, ca: Ca): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${this.endpoint}/${id}`, ca);
  }

  deleteCa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  listar(request: CaRequest): Observable<PagedListDto<Ca>> {
    return this.http.post<PagedListDto<Ca>>(`${this.apiUrl}/${this.endpoint}/listar`, request);
  }
}
