import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente, ClienteRequest } from '../../../models/cliente.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule
  ],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.scss'
})
export class ClienteListComponent implements OnInit, AfterViewInit {
  @ViewChild('campoFiltro') campoFiltro!: ElementRef;
  clientes: Cliente[] = [];
  displayedColumns: string[] = ['id', 'nome', 'uf', 'cidade', 'actions'];
  loading = false;
  filtroNome: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  constructor(
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  ngAfterViewInit(): void {
    // Usamos um pequeno atraso para garantir que o componente foi totalmente renderizado
    setTimeout(() => {
      if (this.campoFiltro) {
        this.campoFiltro.nativeElement.focus();
      }
    }, 100);
  }

  loadClientes(): void {
    this.loading = true;
    const request: ClienteRequest = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      nome: this.filtroNome || undefined
    };
    
    this.clienteService.listar(request).subscribe({
      next: (data) => {
        this.clientes = data.itens;
        this.totalCount = data.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar clientes', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  filtrar(): void {
    this.pageNumber = 1;
    this.loadClientes();
  }

  limparFiltro(): void {
    this.filtroNome = '';
    this.pageNumber = 1;
    this.loadClientes();
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadClientes();
  }

  deleteCliente(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: 'Deseja realmente excluir este cliente?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteService.deleteCliente(id).subscribe({
          next: () => {
            this.snackBar.open('Cliente excluído com sucesso', 'Fechar', { duration: 3000 });
            this.loadClientes();
          },
          error: (error) => {
            this.snackBar.open('Erro ao excluir cliente', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
