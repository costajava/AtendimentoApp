import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoAtendimento } from '../models/tipo-atendimento.model';
import { PageRequest, PagedListDto } from '../models/page-request.model';
import { ResponseDto } from '../models/response-dto.model';

@Injectable({
  providedIn: 'root'
})
export class TipoAtendimentoService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'api/TipoAtendimento';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipoAtendimento[]> {
    return this.http.get<TipoAtendimento[]>(`${this.apiUrl}/${this.endpoint}`);
  }

  getById(id: number): Observable<ResponseDto<TipoAtendimento>> {
    return this.http.get<ResponseDto<TipoAtendimento>>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  create(tipoAtendimento: TipoAtendimento): Observable<TipoAtendimento> {
    return this.http.post<TipoAtendimento>(`${this.apiUrl}/${this.endpoint}`, tipoAtendimento);
  }

  update(id: number, tipoAtendimento: TipoAtendimento): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${this.endpoint}/${id}`, tipoAtendimento);
  }

  deleteTipoAtendimento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  listar(request: PageRequest): Observable<PagedListDto<TipoAtendimento>> {
    return this.http.post<PagedListDto<TipoAtendimento>>(`${this.apiUrl}/${this.endpoint}/listar`, request);
  }
}
