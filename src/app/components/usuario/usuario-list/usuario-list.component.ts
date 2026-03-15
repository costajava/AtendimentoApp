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
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario, UsuarioRequest } from '../../../models/usuario.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss'
})
export class UsuarioListComponent implements OnInit, AfterViewInit {
  @ViewChild('campoFiltro') campoFiltro!: ElementRef;
  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['id', 'nome', 'email', 'actions'];
  loading = false;
  filtroNome: string = '';
  
  // Paginação
  pageIndex: number = 0;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(private usuarioService: UsuarioService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  ngAfterViewInit(): void {
    // Usamos um pequeno atraso para garantir que o componente foi totalmente renderizado
    setTimeout(() => {
      if (this.campoFiltro) {
        this.campoFiltro.nativeElement.focus();
      }
    }, 100);
  }

  loadUsuarios(): void {
    this.loading = true;
    const request: UsuarioRequest = {
      pageNumber: this.pageIndex + 1, // API usa base 1, paginator usa base 0
      pageSize: this.pageSize,
      nome: this.filtroNome || undefined
    };

    this.usuarioService.listar(request).subscribe({
      next: (data) => { 
        this.usuarios = data.itens;
        this.totalCount = data.totalCount;
        this.loading = false;
      },
      error: () => { this.snackBar.open('Erro ao carregar usuários', 'Fechar', { duration: 3000 }); this.loading = false; }
    });
  }

  aplicarFiltro(): void {
    this.pageIndex = 0; // Resetar para primeira página ao filtrar
    this.loadUsuarios();
  }

  limparFiltro(): void {
    this.filtroNome = '';
    this.pageIndex = 0;
    this.loadUsuarios();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsuarios();
  }

  deleteUsuario(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar Exclusão', message: 'Deseja realmente excluir este usuário?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarioService.deleteUsuario(id).subscribe({
          next: () => { this.snackBar.open('Usuário excluído com sucesso', 'Fechar', { duration: 3000 }); this.loadUsuarios(); },
          error: () => this.snackBar.open('Erro ao excluir usuário', 'Fechar', { duration: 3000 })
        });
      }
    });
  }
}
