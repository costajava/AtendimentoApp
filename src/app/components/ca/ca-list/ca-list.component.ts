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
import { CaService } from '../../../services/ca.service';
import { Ca, CaRequest } from '../../../models/ca.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ca-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './ca-list.component.html'
})
export class CaListComponent implements OnInit, AfterViewInit {
  @ViewChild('campoFiltro') campoFiltro!: ElementRef;
  cas: Ca[] = [];
  displayedColumns: string[] = ['id', 'nome', 'cidade', 'uf', 'actions'];
  loading = false;
  filtroNome: string = '';
  
  // Paginação
  pageIndex: number = 0;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(private caService: CaService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCas();
  }

  ngAfterViewInit(): void {
    // Usamos um pequeno atraso para garantir que o componente foi totalmente renderizado
    setTimeout(() => {
      if (this.campoFiltro) {
        this.campoFiltro.nativeElement.focus();
      }
    }, 100);
  }

  loadCas(): void {
    this.loading = true;
    const request: CaRequest = {
      pageNumber: this.pageIndex + 1, // API usa base 1, paginator usa base 0
      pageSize: this.pageSize,
      nome: this.filtroNome || undefined
    };

    this.caService.listar(request).subscribe({
      next: (data) => { 
        this.cas = data.itens;
        this.totalCount = data.totalCount;
        this.loading = false;
      },
      error: () => { this.snackBar.open('Erro ao carregar CAs', 'Fechar', { duration: 3000 }); this.loading = false; }
    });
  }

  aplicarFiltro(): void {
    this.pageIndex = 0; // Resetar para primeira página ao filtrar
    this.loadCas();
  }

  limparFiltro(): void {
    this.filtroNome = '';
    this.pageIndex = 0;
    this.loadCas();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCas();
  }

  deleteCa(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar Exclusão', message: 'Deseja realmente excluir este CA?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.caService.deleteCa(id).subscribe({
          next: () => { this.snackBar.open('CA excluído com sucesso', 'Fechar', { duration: 3000 }); this.loadCas(); },
          error: () => this.snackBar.open('Erro ao excluir CA', 'Fechar', { duration: 3000 })
        });
      }
    });
  }
}
