export interface Modulo {
  id: number;
  nome: string;
}

export interface ModuloRequest {
  pageNumber: number;
  pageSize: number;
  nome?: string;
}
