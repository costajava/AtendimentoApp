import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Assunto } from '../models/assunto.model';
import { PageRequest, PagedListDto } from '../models/page-request.model';
import { ResponseDto } from '../models/response-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AssuntoService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'api/Assunto';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Assunto[]> {
    return this.http.get<Assunto[]>(`${this.apiUrl}/${this.endpoint}`);
  }

  getById(id: number): Observable<ResponseDto<Assunto>> {
    return this.http.get<ResponseDto<Assunto>>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  create(assunto: Assunto): Observable<Assunto> {
    return this.http.post<Assunto>(`${this.apiUrl}/${this.endpoint}`, assunto);
  }

  update(id: number, assunto: Assunto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${this.endpoint}/${id}`, assunto);
  }

  deleteAssunto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  listar(request: PageRequest): Observable<PagedListDto<Assunto>> {
    return this.http.post<PagedListDto<Assunto>>(`${this.apiUrl}/${this.endpoint}/listar`, request);
  }
}
