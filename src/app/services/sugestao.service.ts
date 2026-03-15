import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sugestao } from '../models/sugestao.model';
import { PageRequest, PagedListDto } from '../models/page-request.model';
import { ResponseDto } from '../models/response-dto.model';

@Injectable({
  providedIn: 'root'
})
export class SugestaoService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'api/Sugestao';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sugestao[]> {
    return this.http.get<Sugestao[]>(`${this.apiUrl}/${this.endpoint}`);
  }

  getById(id: number): Observable<ResponseDto<Sugestao>> {
    return this.http.get<ResponseDto<Sugestao>>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  create(sugestao: Sugestao): Observable<Sugestao> {
    return this.http.post<Sugestao>(`${this.apiUrl}/${this.endpoint}`, sugestao);
  }

  update(id: number, sugestao: Sugestao): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${this.endpoint}/${id}`, sugestao);
  }

  deleteSugestao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  listar(request: PageRequest): Observable<PagedListDto<Sugestao>> {
    return this.http.post<PagedListDto<Sugestao>>(`${this.apiUrl}/${this.endpoint}/listar`, request);
  }
}
