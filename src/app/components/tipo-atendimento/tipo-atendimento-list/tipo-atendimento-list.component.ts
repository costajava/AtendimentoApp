import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TipoAtendimentoService } from '../../../services/tipo-atendimento.service';
import { TipoAtendimento, TipoAtendimentoRequest } from '../../../models/tipo-atendimento.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tipo-atendimento-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './tipo-atendimento-list.component.html',
  styleUrl: './tipo-atendimento-list.component.scss'
})
export class TipoAtendimentoListComponent implements OnInit, AfterViewInit {
  @ViewChild('campoFiltro') campoFiltro!: ElementRef;
  tipos: TipoAtendimento[] = [];
  displayedColumns: string[] = ['id', 'descricao', 'actions'];
  loading = false;
  filtroDescricao: string = '';
  
  // Paginação
  pageIndex: number = 0;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(private tipoAtendimentoService: TipoAtendimentoService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTipos();
  }

  ngAfterViewInit(): void {
    // Usamos um pequeno atraso para garantir que o componente foi totalmente renderizado
    setTimeout(() => {
      if (this.campoFiltro) {
        this.campoFiltro.nativeElement.focus();
      }
    }, 100);
  }

  loadTipos(): void {
    this.loading = true;
    const request: TipoAtendimentoRequest = {
      pageNumber: this.pageIndex + 1, // API usa base 1, paginator usa base 0
      pageSize: this.pageSize,
      descricao: this.filtroDescricao || undefined
    };

    this.tipoAtendimentoService.listar(request).subscribe({
      next: (data) => {
        this.tipos = data.itens;
        this.totalCount = data.totalCount;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar tipos', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  aplicarFiltro(): void {
    this.pageIndex = 0; // Resetar para primeira página ao filtrar
    this.loadTipos();
  }

  limparFiltro(): void {
    this.filtroDescricao = '';
    this.pageIndex = 0;
    this.loadTipos();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTipos();
  }

  deleteTipo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar Exclusão', message: 'Deseja realmente excluir este tipo de atendimento?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tipoAtendimentoService.deleteTipoAtendimento(id).subscribe({
          next: () => { this.snackBar.open('Tipo excluído com sucesso', 'Fechar', { duration: 3000 }); this.loadTipos(); },
          error: () => this.snackBar.open('Erro ao excluir tipo', 'Fechar', { duration: 3000 })
        });
      }
    });
  }
}
