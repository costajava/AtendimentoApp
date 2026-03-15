import { Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsuarioService } from '../../../services/usuario.service';
import { ModuloService } from '../../../services/modulo.service';
import { PerfilUsuario, UsuarioCriacao } from '../../../models/usuario.model';
import { Modulo } from '../../../models/modulo.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  errorMessages: string[] = [];
  private errorTimeout: any;
  perfis = [
    { value: PerfilUsuario.Administrador, label: 'Administrador' },
    { value: PerfilUsuario.Gerente, label: 'Gerente' },
    { value: PerfilUsuario.Atendente, label: 'Atendente' }
  ];
  modulos: Modulo[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private moduloService: ModuloService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      perfil: [PerfilUsuario.Atendente, [Validators.required]],
      moduloId: [null],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', [Validators.required]]
    }, { validators: this.senhasCombinam });
  }

  ngOnInit(): void {
    this.carregarModulos();
  }

  carregarModulos(): void {
    this.moduloService.getAll().subscribe({
      next: (modulos) => {
        this.modulos = modulos;
      },
      error: (error) => {
        console.error('Erro ao carregar módulos:', error);
      }
    });
  }

  senhasCombinam(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senha')?.value;
    const confirmaSenha = control.get('confirmaSenha')?.value;
    
    if (senha && confirmaSenha && senha !== confirmaSenha) {
      control.get('confirmaSenha')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.clearErrorMessages();
    const formValue = { ...this.registerForm.value };
    
    const usuarioCriacao: UsuarioCriacao = {
      id: 0,
      nome: formValue.nome,
      email: formValue.email,
      perfil: formValue.perfil,
      moduloId: formValue.moduloId || null,
      senha: formValue.senha,
      confirmaSenha: formValue.confirmaSenha
    };
    
    this.usuarioService.create(usuarioCriacao).subscribe({
      next: () => {
        this.snackBar.open('Registro realizado com sucesso! Faça login para continuar.', 'Fechar', { duration: 5000 });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.handleErrorResponse(error);
        this.loading = false;
      }
    });
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
      this.errorMessages = [error.error?.message || error.error?.mensagem || 'Erro ao registrar. Tente novamente.'];
    }
    this.setErrorTimeout();
  }

  getPerfilLabel(perfil: PerfilUsuario): string {
    return this.perfis.find(p => p.value === perfil)?.label || '';
  }

  ngOnDestroy(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }
}
