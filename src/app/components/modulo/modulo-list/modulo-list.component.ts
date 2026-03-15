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
import { ModuloService } from '../../../services/modulo.service';
import { Modulo, ModuloRequest } from '../../../models/modulo.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-modulo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './modulo-list.component.html',
  styleUrl: './modulo-list.component.scss'
})
export class ModuloListComponent implements OnInit, AfterViewInit {
  @ViewChild('campoFiltro') campoFiltro!: ElementRef;
  modulos: Modulo[] = [];
  displayedColumns: string[] = ['id', 'nome', 'actions'];
  loading = false;
  filtroNome: string = '';
  
  // Paginação
  pageIndex: number = 0;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(private moduloService: ModuloService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadModulos();
  }

  ngAfterViewInit(): void {
    // Usamos um pequeno atraso para garantir que o componente foi totalmente renderizado
    setTimeout(() => {
      if (this.campoFiltro) {
        this.campoFiltro.nativeElement.focus();
      }
    }, 100);
  }

  loadModulos(): void {
    this.loading = true;
    const request: ModuloRequest = {
      pageNumber: this.pageIndex + 1, // API usa base 1, paginator usa base 0
      pageSize: this.pageSize,
      nome: this.filtroNome || undefined
    };

    this.moduloService.listar(request).subscribe({
      next: (data) => {
        this.modulos = data.itens;
        this.totalCount = data.totalCount;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar módulos', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  aplicarFiltro(): void {
    this.pageIndex = 0; // Resetar para primeira página ao filtrar
    this.loadModulos();
  }

  limparFiltro(): void {
    this.filtroNome = '';
    this.pageIndex = 0;
    this.loadModulos();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadModulos();
  }

  deleteModulo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar Exclusão', message: 'Deseja realmente excluir este módulo?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.moduloService.deleteModulo(id).subscribe({
          next: () => { this.snackBar.open('Módulo excluído com sucesso', 'Fechar', { duration: 3000 }); this.loadModulos(); },
          error: () => this.snackBar.open('Erro ao excluir módulo', 'Fechar', { duration: 3000 })
        });
      }
    });
  }
}
