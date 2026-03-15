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
import { SugestaoService } from '../../../services/sugestao.service';
import { Sugestao } from '../../../models/sugestao.model';

@Component({
  selector: 'app-sugestao-form',
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
  templateUrl: './sugestao-form.component.html',
  styleUrl: './sugestao-form.component.scss'
})
export class SugestaoFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('primeiroCampo') primeiroCampo!: ElementRef;
  form: FormGroup;
  isEditMode = false;
  sugestaoId?: number;
  loading = false;
  errorMessages: string[] = [];
  private errorTimeout: any;

  constructor(
    private fb: FormBuilder, 
    private sugestaoService: SugestaoService, 
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
      this.sugestaoId = +id;
      this.loadSugestao(this.sugestaoId);
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

  loadSugestao(id: number): void {
    this.loading = true;
    this.clearErrorMessages();
    this.sugestaoService.getById(id).subscribe({
      next: (response: any) => {
        if (response.sucesso && response.dados) {
          this.form.patchValue(response.dados);
          if (response.mensagem) {
            this.snackBar.open(response.mensagem, 'Fechar', { duration: 3000 });
          }
        } else {
          this.handleErrorResponse({ error: { message: response.mensagem || 'Erro ao carregar sugestão' } });
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
      const sugestao: Sugestao = this.form.value;

      const handleSuccess = (message: string) => {
        this.snackBar.open(message, 'Fechar', { duration: 3000 });
        this.router.navigate(['/sugestoes']);
      };

      const handleError = (error: any) => {
        this.handleErrorResponse(error);
        this.loading = false;
      };

      if (this.isEditMode && this.sugestaoId) {
        this.sugestaoService.update(this.sugestaoId, sugestao).subscribe({
          next: () => handleSuccess('Sugestão atualizada com sucesso'),
          error: (error: any) => handleError(error)
        });
      } else {
        this.sugestaoService.create(sugestao).subscribe({
          next: () => handleSuccess('Sugestão criada com sucesso'),
          error: (error: any) => handleError(error)
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/sugestoes']);
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
