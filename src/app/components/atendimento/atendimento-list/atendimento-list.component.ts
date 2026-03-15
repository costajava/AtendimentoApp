import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AtendimentoService } from '../../../services/atendimento.service';
import { Atendimento, AtendimentoRequest, StatusAtendimento } from '../../../models/atendimento.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { DateMaskDirective } from '../../../directives/date-mask.directive';
import { PtBrDateAdapter } from '../../../core/pt-br-date-adapter';
import { CUSTOM_DATE_FORMATS } from '../../../app.config';
import { PerfilUsuario } from '../../../models/usuario.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-atendimento-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSnackBarModule, MatDialogModule, MatTooltipModule, DateMaskDirective],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: PtBrDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
  templateUrl: './atendimento-list.component.html',
  styleUrl: './atendimento-list.component.scss'
})
export class AtendimentoListComponent implements OnInit, AfterViewInit {
  @ViewChild('campoDataInicial') campoDataInicial!: ElementRef;
  atendimentos: Atendimento[] = [];
  displayedColumns: string[] = ['id', 'nomeCa', 'nomeCliente', 'contato', 'dataAtendimento', 'atendimentoConcluido', 'actions'];
  loading = false;
  // Expor enum para o template
  StatusAtendimento = StatusAtendimento;
  
  // Filtros
  dataInicial: Date = new Date();
  dataFinal: Date = new Date();
  
  // Paginação
  pageIndex: number = 0;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(private atendimentoService: AtendimentoService, 
              private snackBar: MatSnackBar, 
              private dialog: MatDialog,
              private authService: AuthService) {}  
    
  ngOnInit(): void {
    this.loadAtendimentos();
  }

  ngAfterViewInit(): void {
    // Usamos um pequeno atraso para garantir que o componente foi totalmente renderizado
    setTimeout(() => {
      if (this.campoDataInicial) {
        this.campoDataInicial.nativeElement.focus();
      }
    }, 100);
  }

  loadAtendimentos(): void {
    this.loading = true;
    
    // Converter Date para string no formato YYYY-MM-DD (compatível com DateOnly do C#)
    const dataInicialStr = this.dataInicial ? this.formatarDataParaBackend(this.dataInicial) : undefined;
    const dataFinalStr = this.dataFinal ? this.formatarDataParaBackend(this.dataFinal) : undefined;
    
    // Obter usuarioId e perfil a partir do token armazenado
    const usuarioLogado = this.authService.getUsuarioLogado();
    const usuarioId = usuarioLogado?.id;
    const perfil = usuarioLogado?.perfil;
    
    const request: AtendimentoRequest = {
      pageNumber: this.pageIndex + 1, // API usa base 1, paginator usa base 0
      pageSize: this.pageSize,
      dataInicial: dataInicialStr,
      dataFinal: dataFinalStr,
      usuarioId,
      perfil
    };

    this.atendimentoService.listar(request).subscribe({
      next: (data) => {
        this.atendimentos = data.itens;
        this.totalCount = data.totalCount;
        this.loading = false;
        console.log(this.atendimentos);
      },
      error: () => {
        this.snackBar.open('Erro ao carregar atendimentos', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  formatarDataParaBackend(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  aplicarFiltro(): void {
    this.pageIndex = 0; // Resetar para primeira página ao filtrar
    this.loadAtendimentos();
  }

  limparFiltro(): void {
    this.dataInicial = new Date();
    this.dataFinal = new Date();
    this.pageIndex = 0;
    this.loadAtendimentos();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAtendimentos();
  }

  deleteAtendimento(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar Exclusão', message: 'Deseja realmente excluir este atendimento?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.atendimentoService.deleteAtendimento(id).subscribe({
          next: () => { this.snackBar.open('Atendimento excluído com sucesso', 'Fechar', { duration: 3000 }); this.loadAtendimentos(); },
          error: () => this.snackBar.open('Erro ao excluir atendimento', 'Fechar', { duration: 3000 })
        });
      }
    });
  }

  getStatusDescricao(status: StatusAtendimento): string {
    switch (status) {
      case StatusAtendimento.NaoConcluido:
        return 'Não Concluído';
      case StatusAtendimento.Concluido:
        return 'Concluído';
      case StatusAtendimento.Parcialmente:
        return 'Parcialmente';
      default:
        return 'Desconhecido';
    }
  }

  getAtendimentoConcluidoClass(status: StatusAtendimento): string {
    switch (status) {
      case StatusAtendimento.NaoConcluido:
        return 'bg-red-500 text-white';
      case StatusAtendimento.Concluido:
        return 'bg-green-500 text-white';
      case StatusAtendimento.Parcialmente:
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-300 text-white';
    }
  }

  formatarHora(hora: string | null | undefined): string {
    if (!hora) return '-';
    
    // TimeSpan do .NET pode vir como "HH:mm:ss" ou "d.HH:mm:ss" se tiver dias
    // Remove dias se houver (formato "d.HH:mm:ss")
    let horaFormatada = hora;
    if (hora.includes('.')) {
      const partes = hora.split('.');
      if (partes.length > 1) {
        horaFormatada = partes[partes.length - 1]; // Pega a parte após o último ponto
      }
    }
    
    // Aceita HH:mm ou HH:mm:ss e retorna apenas HH:mm
    const parts = horaFormatada.split(':');
    if (parts.length >= 2) {
      const horas = parts[0].padStart(2, '0');
      const minutos = parts[1].padStart(2, '0');
      return `${horas}:${minutos}`;
    }
    
    return hora;
  }

  encerrarAtendimento(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar Encerramento', message: 'Deseja encerrar este atendimento agora?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.atendimentoService.encerrar(id).subscribe({
          next: () => {
            this.snackBar.open('Atendimento encerrado com sucesso', 'Fechar', { duration: 3000 });
            this.loadAtendimentos();
          },
          error: () => this.snackBar.open('Erro ao encerrar atendimento', 'Fechar', { duration: 3000 })
        });
      }
    });
  }
}
