export interface PageRequest {
  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PagedListDto<T> {
  itens: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  mensagem: string;
  sucesso: boolean;
}
