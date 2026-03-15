import { Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { TipoAtendimentoService } from '../../../services/tipo-atendimento.service';
import { TipoAtendimento } from '../../../models/tipo-atendimento.model';

@Component({
  selector: 'app-tipo-atendimento-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './tipo-atendimento-form.component.html',
  styleUrl: './tipo-atendimento-form.component.scss'
})
export class TipoAtendimentoFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('primeiroCampo') primeiroCampo!: ElementRef;
  form: FormGroup;
  isEditMode = false;
  tipoId?: number;
  loading = false;
  errorMessages: string[] = [];
  private errorTimeout: any;

  constructor(
    private fb: FormBuilder, 
    private tipoAtendimentoService: TipoAtendimentoService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.form = this.fb.group({
      id: [0],
      descricao: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.tipoId = +id;
      this.loadTipoAtendimento(this.tipoId);
    }
  }

  ngAfterViewInit(): void {
    // Usamos um pequeno atraso para garantir que o componente foi totalmente renderizado
    setTimeout(() => {
      if (this.primeiroCampo) {
        this.primeiroCampo.nativeElement.focus();
      }
    }, 100);
  }

  loadTipoAtendimento(id: number): void {
    this.loading = true;
    this.clearErrorMessages();
    this.tipoAtendimentoService.getById(id).subscribe({
      next: (response: any) => {
        if (response.sucesso && response.dados) {
          this.form.patchValue(response.dados);
          if (response.mensagem) {
            this.snackBar.open(response.mensagem, 'Fechar', { duration: 3000 });
          }
        } else {
          this.handleErrorResponse({ error: { message: response.mensagem || 'Erro ao carregar tipo' } });
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.handleErrorResponse(error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.clearErrorMessages();
      const tipo: TipoAtendimento = this.form.value;

      const handleSuccess = (message: string) => {
        this.snackBar.open(message, 'Fechar', { duration: 3000 });
        this.router.navigate(['/tipos-atendimento']);
      };

      const handleError = (error: any) => {
        this.handleErrorResponse(error);
        this.loading = false;
      };

      if (this.isEditMode && this.tipoId) {
        this.tipoAtendimentoService.update(this.tipoId, tipo).subscribe({
          next: () => handleSuccess('Tipo atualizado com sucesso'),
          error: (error: any) => handleError(error)
        });
      } else {
        this.tipoAtendimentoService.create(tipo).subscribe({
          next: () => handleSuccess('Tipo criado com sucesso'),
          error: (error: any) => handleError(error)
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/tipos-atendimento']);
  }

  clearErrorMessages(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
    this.ngZone.run(() => {
      this.errorMessages = [];
    });
  }

  private setErrorTimeout(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
    if (this.errorMessages && this.errorMessages.length > 0) {
      this.errorTimeout = setTimeout(() => {
        this.ngZone.run(() => {
          if (this.errorMessages && this.errorMessages.length > 0) {
            this.errorMessages = [];
          }
          this.errorTimeout = null;
        });
      }, 8000);
    }
  }

  private handleErrorResponse(error: any): void {
    this.loading = false;
    if (error.status === 400 && error.error?.errors) {
      const validationErrors = error.error.errors;
      this.errorMessages = (Object.values(validationErrors) as string[][])
        .flat()
        .filter((msg: string, index: number, self: string[]) => self.indexOf(msg) === index);
    } else {
      this.errorMessages = [error.error?.message || 'Ocorreu um erro inesperado'];
    }
    this.setErrorTimeout();
  }

  ngOnDestroy(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }
}
