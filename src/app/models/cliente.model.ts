export interface Cliente {
  id: number;
  nome: string;
  uf: string;
  cidade: string;
  caId: number;
  caCompartilhadaId?: number;
}

export interface ClienteRequest {
  pageNumber: number;
  pageSize: number;
  nome?: string;
}
