export interface Assunto {
  id: number;
  tipoAssunto: string;
  moduloId: number;
}

export interface AssuntoRequest {
  pageNumber: number;
  pageSize: number;
  tipoAssunto?: string;
}
