export interface Ca {
  id: number;
  nome: string;
  uf: string;
  cidade: string;
}

export interface CaRequest {
  pageNumber: number;
  pageSize: number;
  nome?: string;
}
