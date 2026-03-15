export interface ResponseDto<T> {
  dados: T | null;
  mensagem: string | null;
  sucesso: boolean;
}
