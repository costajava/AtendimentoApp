export interface TipoAtendimento {
  id: number;
  descricao: string;
}

export interface TipoAtendimentoRequest {
  pageNumber: number;
  pageSize: number;
  descricao?: string;
}
