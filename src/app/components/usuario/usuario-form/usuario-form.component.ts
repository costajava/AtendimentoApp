import { Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { UsuarioService } from '../../../services/usuario.service';
import { ModuloService } from '../../../services/modulo.service';
import { Usuario, UsuarioCriacao } from '../../../models/usuario.model';
import { Modulo } from '../../../models/modulo.model';

@Component({
  selector: 'app-usuario-form',
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
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss'
})
export class UsuarioFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('primeiroCampo') primeiroCampo!: ElementRef;
  form: FormGroup;
  isEditMode = false;
  usuarioId?: number;
  loading = false;
  modulos: Modulo[] = [];
  errorMessages: string[] = [];
  private errorTimeout: any;

  constructor(
    private fb: FormBuilder, 
    private usuarioService: UsuarioService, 
    private moduloService: ModuloService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.form = this.fb.group({
      id: [0],
      nome: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email]],
      moduloId: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadModulos();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.usuarioId = +id;
      this.loadUsuario(this.usuarioId);
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

  loadModulos(): void {
    this.moduloService.getAll().subscribe(data => this.modulos = data);
  }

  loadUsuario(id: number): void {
    this.loading = true;
    this.clearErrorMessages();
    this.usuarioService.getById(id).subscribe({
      next: (response: any) => {
        if (response.sucesso && response.dados) {
          this.form.patchValue(response.dados);
          if (response.mensagem) {
            this.snackBar.open(response.mensagem, 'Fechar', { duration: 3000 });
          }
        } else {
          this.handleErrorResponse({ error: { message: response.mensagem || 'Erro ao carregar usuário' } });
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
      const usuario: UsuarioCriacao = this.form.value;

      const handleSuccess = (message: string) => {
        this.snackBar.open(message, 'Fechar', { duration: 3000 });
        this.router.navigate(['/usuarios']);
      };

      const handleError = (error: any) => {
        this.handleErrorResponse(error);
        this.loading = false;
      };

      if (this.isEditMode && this.usuarioId) {
        this.usuarioService.update(this.usuarioId, usuario).subscribe({
          next: () => handleSuccess('Usuário atualizado com sucesso'),
          error: (error: any) => handleError(error)
        });
      } else {
        this.usuarioService.create(usuario).subscribe({
          next: () => handleSuccess('Usuário criado com sucesso'),
          error: (error: any) => handleError(error)
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/usuarios']);
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
