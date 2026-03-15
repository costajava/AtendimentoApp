import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Atendimento, StatusAtendimento } from '../../../models/atendimento.model';
import { AtendimentoService } from '../../../services/atendimento.service';
import { Cliente } from '../../../models/cliente.model';
import { Usuario } from '../../../models/usuario.model';
import { Assunto } from '../../../models/assunto.model';
import { TipoAtendimento } from '../../../models/tipo-atendimento.model';
import { Modulo } from '../../../models/modulo.model';
import { Ca } from '../../../models/ca.model';
import { Sugestao } from '../../../models/sugestao.model';
import { ClienteService } from '../../../services/cliente.service';
import { UsuarioService } from '../../../services/usuario.service';
import { AssuntoService } from '../../../services/assunto.service';
import { TipoAtendimentoService } from '../../../services/tipo-atendimento.service';
import { ModuloService } from '../../../services/modulo.service';
import { CaService } from '../../../services/ca.service';
import { SugestaoService } from '../../../services/sugestao.service';

@Component({
  selector: 'app-atendimento-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  providers: [DatePipe],
  templateUrl: './atendimento-detail.component.html',
  styleUrl: './atendimento-detail.component.scss'
})
export class AtendimentoDetailComponent implements OnInit {
  atendimento?: Atendimento;
  loading = false;

  clientes: Cliente[] = [];
  usuarios: Usuario[] = [];
  assuntos: Assunto[] = [];
  tiposAtendimento: TipoAtendimento[] = [];
  modulos: Modulo[] = [];
  cas: Ca[] = [];
  sugestoes: Sugestao[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private atendimentoService: AtendimentoService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private assuntoService: AssuntoService,
    private tipoAtendimentoService: TipoAtendimentoService,
    private moduloService: ModuloService,
    private caService: CaService,
    private sugestaoService: SugestaoService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;
    if (!id) {
      this.snackBar.open('ID inválido para consulta', 'Fechar', { duration: 3000 });
      this.router.navigate(['/atendimentos']);
      return;
    }
    this.loadLookups();
    this.loadAtendimento(id);
  }

  private loadLookups(): void {
    this.clienteService.getAll().subscribe(data => this.clientes = data);
    this.usuarioService.getAll().subscribe(data => this.usuarios = data);
    this.assuntoService.getAll().subscribe(data => this.assuntos = data);
    this.tipoAtendimentoService.getAll().subscribe(data => this.tiposAtendimento = data);
    this.moduloService.getAll().subscribe(data => this.modulos = data);
    this.caService.getAll().subscribe(data => this.cas = data);
    this.sugestaoService.getAll().subscribe(data => this.sugestoes = data);
  }

  private loadAtendimento(id: number): void {
    this.loading = true;
    this.atendimentoService.getById(id).subscribe({
      next: (response) => {
        if (response.sucesso && response.dados) {
          this.atendimento = response.dados as Atendimento;
        } else {
          this.snackBar.open(response.mensagem || 'Erro ao carregar atendimento', 'Fechar', { duration: 3000 });
          this.router.navigate(['/atendimentos']);
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar atendimento', 'Fechar', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/atendimentos']);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/atendimentos']);
  }

  formatarData(dateOnly: string | Date | null | undefined): string {
    if (!dateOnly) return '-';
    const date = typeof dateOnly === 'string' ? new Date(dateOnly) : dateOnly;
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '-';
  }

  formatarHora(hora: string | null | undefined): string {
    if (!hora) return '-';
    let horaFormatada = hora;
    if (hora.includes('.')) {
      const partes = hora.split('.');
      if (partes.length > 1) {
        horaFormatada = partes[partes.length - 1];
      }
    }
    const parts = horaFormatada.split(':');
    if (parts.length >= 2) {
      const horas = parts[0].padStart(2, '0');
      const minutos = parts[1].padStart(2, '0');
      return `${horas}:${minutos}`;
    }
    return hora;
  }

  statusDescricao(status: StatusAtendimento | null | undefined): string {
    switch (status) {
      case StatusAtendimento.NaoConcluido:
        return 'Não Concluído';
      case StatusAtendimento.Concluido:
        return 'Concluído';
      case StatusAtendimento.Parcialmente:
        return 'Parcialmente';
      default:
        return '-';
    }
  }

  nomeCa(id: number | null | undefined): string {
    if ((this.atendimento as any)?.nomeCa) return (this.atendimento as any).nomeCa;
    const item = this.cas.find(c => c.id === id);
    return item?.nome || '-';
  }

  nomeCliente(id: number | null | undefined): string {
    if ((this.atendimento as any)?.nomeCliente) return (this.atendimento as any).nomeCliente;
    const item = this.clientes.find(c => c.id === id);
    return item?.nome || '-';
  }

  nomeUsuario(id: number | null | undefined): string {
    const item = this.usuarios.find(u => u.id === id);
    return item?.nome || '-';
  }

  nomeAssunto(id: number | null | undefined): string {
    const item = this.assuntos.find(a => a.id === id);
    return item?.tipoAssunto || '-';
  }

  nomeTipoAtendimento(id: number | null | undefined): string {
    const item = this.tiposAtendimento.find(t => t.id === id);
    return item?.descricao || '-';
  }

  nomeModulo(id: number | null | undefined): string {
    const item = this.modulos.find(m => m.id === id);
    return item?.nome || '-';
  }

  descricaoSugestao(id: number | null | undefined): string {
    const item = this.sugestoes.find(s => s.id === id);
    return item?.descricao || '-';
  }

  nomeCaCompartilhadaPorCliente(clienteId: number | null | undefined): string {
    const cliente = this.clientes.find(c => c.id === clienteId);
    const caCompartilhadaId = cliente?.caCompartilhadaId ?? null;
    if (!caCompartilhadaId) return 'Nenhuma';
    const ca = this.cas.find(c => c.id === caCompartilhadaId);
    return ca?.nome || 'Nenhuma';
  }
}

