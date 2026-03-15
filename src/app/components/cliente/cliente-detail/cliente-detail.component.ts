import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { Ca } from '../../../models/ca.model';
import { CaService } from '../../../services/ca.service';

@Component({
  selector: 'app-cliente-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './cliente-detail.component.html',
  styleUrl: './cliente-detail.component.scss'
})
export class ClienteDetailComponent implements OnInit {
  cliente?: Cliente;
  loading = false;
  cas: Ca[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private clienteService: ClienteService,
    private caService: CaService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;
    if (!id) {
      this.snackBar.open('ID inválido para consulta', 'Fechar', { duration: 3000 });
      this.router.navigate(['/clientes']);
      return;
    }
    this.caService.getAll().subscribe(data => this.cas = data);
    this.loadCliente(id);
  }

  private loadCliente(id: number): void {
    this.loading = true;
    this.clienteService.getById(id).subscribe({
      next: (response) => {
        if (response.sucesso && response.dados) {
          this.cliente = response.dados as Cliente;
        } else {
          this.snackBar.open(response.mensagem || 'Erro ao carregar cliente', 'Fechar', { duration: 3000 });
          this.router.navigate(['/clientes']);
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar cliente', 'Fechar', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/clientes']);
      }
    });
  }

  nomeCa(id: number | null | undefined): string {
    const ca = this.cas.find(c => c.id === id);
    return ca?.nome || '-';
  }

  voltar(): void {
    this.router.navigate(['/clientes']);
  }
}

