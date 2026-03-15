export interface Sugestao {
  id: number;
  descricao: string;
}

export interface SugestaoRequest {
  pageNumber: number;
  pageSize: number;
  descricao?: string;
}
