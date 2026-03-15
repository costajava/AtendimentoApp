import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Atendimento, AtendimentoRequest } from '../models/atendimento.model';
import { PagedListDto } from '../models/page-request.model';
import { ResponseDto } from '../models/response-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'api/Atendimento';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${this.apiUrl}/${this.endpoint}`);
  }

  getById(id: number): Observable<ResponseDto<Atendimento>> {
    return this.http.get<ResponseDto<Atendimento>>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  create(atendimento: Atendimento): Observable<Atendimento> {
    return this.http.post<Atendimento>(`${this.apiUrl}/${this.endpoint}`, atendimento);
  }

  update(id: number, atendimento: Atendimento): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${this.endpoint}/${id}`, atendimento);
  }

  deleteAtendimento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  listar(request: AtendimentoRequest): Observable<PagedListDto<Atendimento>> {
    return this.http.post<PagedListDto<Atendimento>>(`${this.apiUrl}/${this.endpoint}/listar`, request);
  }

  // Encerrar atendimento (PATCH /api/Atendimento/{id})
  encerrar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${this.endpoint}/${id}`, {});
  }
}
