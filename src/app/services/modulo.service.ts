import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Modulo } from '../models/modulo.model';
import { PageRequest, PagedListDto } from '../models/page-request.model';
import { ResponseDto } from '../models/response-dto.model';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'api/Modulo';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.apiUrl}/${this.endpoint}`);
  }

  getById(id: number): Observable<ResponseDto<Modulo>> {
    return this.http.get<ResponseDto<Modulo>>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  create(modulo: Modulo): Observable<Modulo> {
    return this.http.post<Modulo>(`${this.apiUrl}/${this.endpoint}`, modulo);
  }

  update(id: number, modulo: Modulo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${this.endpoint}/${id}`, modulo);
  }

  deleteModulo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  listar(request: PageRequest): Observable<PagedListDto<Modulo>> {
    return this.http.post<PagedListDto<Modulo>>(`${this.apiUrl}/${this.endpoint}/listar`, request);
  }
}
