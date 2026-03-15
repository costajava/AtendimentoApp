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
import { AssuntoService } from '../../../services/assunto.service';
import { Assunto, AssuntoRequest } from '../../../models/assunto.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-assunto-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './assunto-list.component.html',
  styleUrl: './assunto-list.component.scss'
})
export class AssuntoListComponent implements OnInit, AfterViewInit {
  @ViewChild('campoFiltro') campoFiltro!: ElementRef;
  assuntos: Assunto[] = [];
  displayedColumns: string[] = ['id', 'tipoAssunto', 'actions'];
  loading = false;
  filtroTipoAssunto: string = '';
  
  // Paginação
  pageIndex: number = 0;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(
    private assuntoService: AssuntoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAssuntos();
  }

  ngAfterViewInit(): void {
    // Usamos um pequeno atraso para garantir que o componente foi totalmente renderizado
    setTimeout(() => {
      if (this.campoFiltro) {
        this.campoFiltro.nativeElement.focus();
      }
    }, 100);
  }

  loadAssuntos(): void {
    this.loading = true;
    const request: AssuntoRequest = {
      pageNumber: this.pageIndex + 1, // API usa base 1, paginator usa base 0
      pageSize: this.pageSize,
      tipoAssunto: this.filtroTipoAssunto || undefined
    };

    this.assuntoService.listar(request).subscribe({
      next: (data) => {
        this.assuntos = data.itens;
        this.totalCount = data.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar assuntos', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  aplicarFiltro(): void {
    this.pageIndex = 0; // Resetar para primeira página ao filtrar
    this.loadAssuntos();
  }

  limparFiltro(): void {
    this.filtroTipoAssunto = '';
    this.pageIndex = 0;
    this.loadAssuntos();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAssuntos();
  }

  deleteAssunto(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: 'Deseja realmente excluir este assunto?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assuntoService.deleteAssunto(id).subscribe({
          next: () => {
            this.snackBar.open('Assunto excluído com sucesso', 'Fechar', { duration: 3000 });
            this.loadAssuntos();
          },
          error: (error) => {
            this.snackBar.open('Erro ao excluir assunto', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
