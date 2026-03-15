import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Ca } from '../../../models/ca.model';
import { CaService } from '../../../services/ca.service';

@Component({
  selector: 'app-ca-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './ca-detail.component.html',
  styleUrl: './ca-detail.component.scss'
})
export class CaDetailComponent implements OnInit {
  ca?: Ca;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private caService: CaService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;
    if (!id) {
      this.snackBar.open('ID inválido para consulta', 'Fechar', { duration: 3000 });
      this.router.navigate(['/cas']);
      return;
    }
    this.loadCa(id);
  }

  private loadCa(id: number): void {
    this.loading = true;
    this.caService.getById(id).subscribe({
      next: (response) => {
        if (response.sucesso && response.dados) {
          this.ca = response.dados as Ca;
        } else {
          this.snackBar.open(response.mensagem || 'Erro ao carregar CA', 'Fechar', { duration: 3000 });
          this.router.navigate(['/cas']);
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar CA', 'Fechar', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/cas']);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/cas']);
  }
}

