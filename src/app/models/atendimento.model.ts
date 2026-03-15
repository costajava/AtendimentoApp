export interface Atendimento {
  id: number;
  caId: number;
  clienteId?: number | null;
  contato: string;
  tipoAtendimentoId: number;
  dataAtendimento: Date;
  horaInicial?: string; // Campo do backend (TimeSpan) - HoraInicial
  horaFinal?: string; // Variação possível
  moduloId: number;
  assuntoId: number;
  cobrarCliente: boolean;
  atendimentoConcluido: StatusAtendimento;
  sugestaoId: number;
  observacoes: string | null;
  usuarioId: number;
  momeCa?: string | null | undefined;
  nomeCliente?: string | null | undefined;
}

export interface AtendimentoRequest {
  pageNumber: number;
  pageSize: number;
  dataInicial?: string; // Formato YYYY-MM-DD para DateOnly do C#
  dataFinal?: string; // Formato YYYY-MM-DD para DateOnly do C#
  usuarioId?: number; // Somente para Atendente 
  perfil?: number; // Somente para Atendente
}

export enum StatusAtendimento {
  NaoConcluido = 0,
  Concluido = 1,
  Parcialmente = 2
}
