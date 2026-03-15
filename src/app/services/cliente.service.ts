import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente, ClienteRequest } from '../models/cliente.model';
import { PagedListDto } from '../models/page-request.model';
import { ResponseDto } from '../models/response-dto.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'api/Cliente';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/${this.endpoint}`);
  }

  getById(id: number): Observable<ResponseDto<Cliente>> {
    return this.http.get<ResponseDto<Cliente>>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/${this.endpoint}`, cliente);
  }

  update(id: number, cliente: Cliente): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${this.endpoint}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  listar(request: ClienteRequest): Observable<PagedListDto<Cliente>> {
    return this.http.post<PagedListDto<Cliente>>(`${this.apiUrl}/${this.endpoint}/listar`, request);
  }
}
