import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AssuntoService } from '../../../services/assunto.service';
import { ModuloService } from '../../../services/modulo.service';
import { Assunto } from '../../../models/assunto.model';
import { Modulo } from '../../../models/modulo.model';

@Component({
  selector: 'app-assunto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './assunto-form.component.html',
  styleUrl: './assunto-form.component.scss'
})
export class AssuntoFormComponent implements OnInit, AfterViewInit {
  @ViewChild('primeiroCampo') primeiroCampo!: ElementRef;
  form: FormGroup;
  isEditMode = false;
  assuntoId?: number;
  loading = false;
  modulos: Modulo[] = [];
  errorMessages: string[] = [];
  private errorTimeout: any;

  constructor(
    private fb: FormBuilder,
    private assuntoService: AssuntoService,
    private moduloService: ModuloService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.form = this.fb.group({
      id: [0],
      tipoAssunto: ['', [Validators.required, Validators.maxLength(50)]],
      moduloId: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadDependencies();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.assuntoId = +id;
      this.loadAssunto(this.assuntoId);
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

  loadDependencies(): void {
    this.moduloService.getAll().subscribe({
      next: (data) => this.modulos = data,
      error: () => this.snackBar.open('Erro ao carregar módulos', 'Fechar', { duration: 3000 })
    });
  }

  loadAssunto(id: number): void {
    this.loading = true;
    this.clearErrorMessages();
    
    this.assuntoService.getById(id).subscribe({
      next: (response) => {
        if (response.sucesso && response.dados) {
          this.form.patchValue(response.dados);
          if (response.mensagem) {
            this.snackBar.open(response.mensagem, 'Fechar', { duration: 3000 });
          }
        } else {
          this.errorMessages = [response.mensagem || 'Erro ao carregar assunto'];
          this.setErrorTimeout();
          this.router.navigate(['/assuntos']);
        }
        this.loading = false;
      },
      error: (error) => {
        this.handleErrorResponse(error);
        this.loading = false;
        this.router.navigate(['/assuntos']);
      }
    });
  }

  clearErrorMessages(event?: Event): void {
    // Previne a propagação do evento para evitar comportamentos indesejados
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Cancela o timeout atual se existir
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
    
    // Limpa as mensagens de erro usando o NgZone para garantir a detecção de mudanças
    this.ngZone.run(() => {
      this.errorMessages = [];
    });
  }

  private setErrorTimeout(): void {
    // Limpa qualquer timeout existente
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
    
    // Só cria um novo timeout se houver mensagens para exibir
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
      // Coleta todas as mensagens de erro
      const validationErrors = error.error.errors;
      this.errorMessages = (Object.values(validationErrors) as string[][])
        .flat()
        .filter((msg: string, index: number, self: string[]) => self.indexOf(msg) === index); // Remove duplicados
    } else {
      this.errorMessages = [error.error?.message || 'Ocorreu um erro inesperado'];
    }
    
    // Configura o timeout para limpar as mensagens
    this.setErrorTimeout();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.clearErrorMessages();
      const assunto: Assunto = this.form.value;

      const handleSuccess = () => {
        this.snackBar.open(
          this.isEditMode ? 'Assunto atualizado com sucesso' : 'Assunto criado com sucesso', 
          'Fechar', 
          { duration: 3000 }
        );
        this.router.navigate(['/assuntos']);
      };

      const handleError = (error: any) => {
        this.handleErrorResponse(error);
      };

      if (this.isEditMode && this.assuntoId) {
        this.assuntoService.update(this.assuntoId, assunto).subscribe({
          next: handleSuccess,
          error: handleError
        });
      } else {
        this.assuntoService.create(assunto).subscribe({
          next: handleSuccess,
          error: handleError
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/assuntos']);
  }

  ngOnDestroy() {
    // Limpa o timeout ao destruir o componente
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }
}
