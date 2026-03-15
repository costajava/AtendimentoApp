export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  moduloId: number;
}

export interface UsuarioCriacao {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  moduloId: number;
  senha: string;
  confirmaSenha: string;
}

export interface TrocarSenha {
  usuarioId: number;
  senhaAtual: string;
  novaSenha: string;
  confirmaSenha: string;
}

export interface UsuarioRequest {
  pageNumber: number;
  pageSize: number;
  nome?: string;
}

export enum PerfilUsuario {
  Administrador = 0,
  Gerente = 1,
  Atendente = 2
}