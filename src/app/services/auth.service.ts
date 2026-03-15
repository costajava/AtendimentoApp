import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario, PerfilUsuario } from '../models/usuario.model';
import { ResponseDto } from '../models/response-dto.model';

interface LoginRequest {
  nome: string;
  senha: string;
}

interface LoginResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private usuarioLogadoSubject: BehaviorSubject<Usuario | null>;
  public usuarioLogado$: Observable<Usuario | null>;
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.usuarioLogadoSubject = new BehaviorSubject<Usuario | null>(this.getUsuarioLogado());
    this.usuarioLogado$ = this.usuarioLogadoSubject.asObservable();
  }

  login(nome: string, senha: string): Observable<ResponseDto<LoginResponse>> {
    const loginRequest: LoginRequest = { nome, senha };
    return this.http.post<ResponseDto<LoginResponse>>(`${this.apiUrl}/api/Usuario/login`, loginRequest)
      .pipe(
        tap(response => {
          if (response.sucesso && response.dados) {
            console.log(response.dados);
            this.armazenarToken(response.dados.token);
            this.usuarioLogadoSubject.next(response.dados.usuario);
          }
        })
      );
  }

  validarCodigoSeguranca(email: string, codigoSeguranca: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/Usuario/validar-codigo-seguranca?email=${email}&codigoSeguranca=${codigoSeguranca}`, {});
  }

  esqueciSenha(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/Usuario/esqueci-senha?email=${email}`, {});
  }

  redefinirSenha(dto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/Usuario/redefinir-senha`, dto);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.usuarioLogadoSubject.next(null);
    this.router.navigate(['/login']);
  }

  private armazenarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAutenticado(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch {
      return false;
    }
  }

  getUsuarioLogado(): Usuario | null {
    if (!this.isAutenticado()) {
      return null;
    }

    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return {
        id: parseInt(decodedToken.sub, 10),
        nome: decodedToken.unique_name,
        email: decodedToken.email,
        perfil: this.mapearPerfil(decodedToken.perfil),
        moduloId: decodedToken.moduloId ? parseInt(decodedToken.moduloId, 10) : 0
      };
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  private mapearPerfil(perfilString: string): PerfilUsuario {
    switch (perfilString) {
      case 'Administrador':
      case '0':
        return PerfilUsuario.Administrador;
      case 'Gerente':
      case '1':
        return PerfilUsuario.Gerente;
      case 'Atendente':
      case '2':
        return PerfilUsuario.Atendente;
      default:
        return PerfilUsuario.Atendente;
    }
  }

  temPermissao(perfilRequerido: PerfilUsuario): boolean {
    const usuario = this.getUsuarioLogado();
    if (!usuario) return false;

    // Administrador tem acesso a tudo
    if (usuario.perfil === PerfilUsuario.Administrador) return true;
    
    return usuario.perfil === perfilRequerido;
  }

  temQualquerPermissao(perfis: PerfilUsuario[]): boolean {
    if (!perfis || perfis.length === 0) return true;
    return perfis.some(perfil => this.temPermissao(perfil));
  }

  isAdmin(): boolean {
    return this.getUsuarioLogado()?.perfil === PerfilUsuario.Administrador;
  }

  isGerente(): boolean {
    return this.getUsuarioLogado()?.perfil === PerfilUsuario.Gerente;
  }

  isAtendente(): boolean {
    return this.getUsuarioLogado()?.perfil === PerfilUsuario.Atendente;
  }
}
