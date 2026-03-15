import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatStepperModule,
  ],
  templateUrl: './redefinir-senha.component.html',
  styleUrl: './redefinir-senha.component.scss'
})
export class RedefinirSenhaComponent implements OnInit {
  emailForm: FormGroup;
  codigoForm: FormGroup;
  senhaForm: FormGroup;
  
  loading = false;
  hideSenha = true;
  hideConfirmaSenha = true;
  
  email = '';
  codigoSeguranca = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    // Passo 1: Email
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Passo 2: Código de Segurança
    this.codigoForm = this.fb.group({
      codigo: ['', [Validators.required]]
    });

    // Passo 3: Nova Senha
    this.senhaForm = this.fb.group({
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Se vier email na query param, já preenche (opcional, mas bom pra UX)
    const emailParam = this.route.snapshot.queryParamMap.get('email');
    if (emailParam) {
      this.emailForm.patchValue({ email: emailParam });
    }
  }

  passwordMatchValidator(control: AbstractControl) {
    const senha = control.get('senha');
    const confirmacao = control.get('confirmaSenha');

    if (senha && confirmacao && senha.value !== confirmacao.value) {
      confirmacao.setErrors({ mismatch: true });
    } else {
      if (confirmacao?.hasError('mismatch')) {
        confirmacao.setErrors(null);
      }
    }
    return null;
  }

  // Passo 1: Solicitar Código
  solicitarCodigo(stepper: any) {
    if (this.emailForm.valid) {
      this.loading = true;
      this.email = this.emailForm.value.email;
      
      this.authService.esqueciSenha(this.email).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open(response.mensagem || 'Código de segurança enviado para seu e-mail.', 'Fechar', {
            duration: 5000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          stepper.next();
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          const msg = err.error?.message || 'Erro ao solicitar código. Verifique o e-mail.';
          this.snackBar.open(msg, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  // Passo 2: Validar Código
  validarCodigo(stepper: any) {
    if (this.codigoForm.valid) {
      this.loading = true;
      this.codigoSeguranca = this.codigoForm.value.codigo;

      this.authService.validarCodigoSeguranca(this.email, this.codigoSeguranca).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open(response.mensagem || 'Código validado com sucesso.', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          stepper.next();
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          const msg = err.error?.message || 'Código inválido.';
          this.snackBar.open(msg, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  // Passo 3: Redefinir Senha
  redefinirSenha() {
    if (this.senhaForm.valid) {
      this.loading = true;
      
      const dto = {
        email: this.email,
        codigoSeguranca: this.codigoSeguranca,
        novaSenha: this.senhaForm.value.senha,
        confirmaSenha: this.senhaForm.value.confirmaSenha
      };

      this.authService.redefinirSenha(dto).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open(response.mensagem || 'Senha redefinida com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          const msg = err.error?.message || 'Erro ao redefinir senha.';
          this.snackBar.open(msg, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }
}
