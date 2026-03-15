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
import { SugestaoService } from '../../../services/sugestao.service';
import { Sugestao, SugestaoRequest } from '../../../models/sugestao.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sugestao-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './sugestao-list.component.html',
  styleUrl: './sugestao-list.component.scss'
})
export class SugestaoListComponent implements OnInit, AfterViewInit {
  @ViewChild('campoFiltro') campoFiltro!: ElementRef;
  sugestoes: Sugestao[] = [];
  displayedColumns: string[] = ['id', 'descricao', 'actions'];
  loading = false;
  filtroDescricao: string = '';
  
  // Paginação
  pageIndex: number = 0;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(private sugestaoService: SugestaoService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadSugestoes();
  }

  ngAfterViewInit(): void {
    // Usamos um pequeno atraso para garantir que o componente foi totalmente renderizado
    setTimeout(() => {
      if (this.campoFiltro) {
        this.campoFiltro.nativeElement.focus();
      }
    }, 100);
  }

  loadSugestoes(): void {
    this.loading = true;
    const request: SugestaoRequest = {
      pageNumber: this.pageIndex + 1, // API usa base 1, paginator usa base 0
      pageSize: this.pageSize,
      descricao: this.filtroDescricao || undefined
    };

    this.sugestaoService.listar(request).subscribe({
      next: (data) => {
        this.sugestoes = data.itens;
        this.totalCount = data.totalCount;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar sugestões', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  aplicarFiltro(): void {
    this.pageIndex = 0; // Resetar para primeira página ao filtrar
    this.loadSugestoes();
  }

  limparFiltro(): void {
    this.filtroDescricao = '';
    this.pageIndex = 0;
    this.loadSugestoes();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSugestoes();
  }

  deleteSugestao(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar Exclusão', message: 'Deseja realmente excluir esta sugestão?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sugestaoService.deleteSugestao(id).subscribe({
          next: () => { this.snackBar.open('Sugestão excluída com sucesso', 'Fechar', { duration: 3000 }); this.loadSugestoes(); },
          error: () => this.snackBar.open('Erro ao excluir sugestão', 'Fechar', { duration: 3000 })
        });
      }
    });
  }
}
