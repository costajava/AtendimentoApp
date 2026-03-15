import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario, UsuarioCriacao, TrocarSenha } from '../models/usuario.model';
import { PageRequest, PagedListDto } from '../models/page-request.model';
import { ResponseDto } from '../models/response-dto.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'api/Usuario';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/${this.endpoint}`);
  }

  getById(id: number): Observable<ResponseDto<Usuario>> {
    return this.http.get<ResponseDto<Usuario>>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  create(usuario: UsuarioCriacao ): Observable<UsuarioCriacao> {
    return this.http.post<UsuarioCriacao>(`${this.apiUrl}/${this.endpoint}`, usuario);
  }

  update(id: number, usuario: Usuario): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${this.endpoint}/${id}`, usuario);
  }

  trocarSenha(dto: TrocarSenha): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${this.endpoint}/trocar-senha`, dto);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  listar(request: PageRequest): Observable<PagedListDto<Usuario>> {
    return this.http.post<PagedListDto<Usuario>>(`${this.apiUrl}/${this.endpoint}/listar`, request);
  }
}
