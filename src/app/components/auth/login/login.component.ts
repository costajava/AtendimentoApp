import { Component, ChangeDetectorRef, NgZone, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy, AfterViewInit {
  @ViewChild('campoUsuario') campoUsuario!: ElementRef;
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  errorMessages: string[] = [];
  private errorTimeout: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.loginForm = this.fb.group({
      nome: ['', [Validators.required]],
      senha: ['', [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    // Foca no campo de usuário após renderização do componente
    setTimeout(() => {
      if (this.campoUsuario && this.campoUsuario.nativeElement) {
        this.campoUsuario.nativeElement.focus();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.clearErrorMessages();
      
      this.authService.login(
        this.loginForm.value.nome,
        this.loginForm.value.senha
      ).subscribe({
        next: (response) => {
          this.snackBar.open('Login realizado com sucesso', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error(error);
          this.loading = false;
          
          if (error.status === 401) {
            this.errorMessages = ['Usuário ou senha inválidos'];
          } else {
            this.errorMessages = [error.error?.message || 'Ocorreu um erro ao realizar login'];
          }
          this.setErrorTimeout();
        }
      });
    }
  }

  abrirEsqueciSenha(): void {
    this.router.navigate(['/redefinir-senha']);
  }

  private setErrorTimeout(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    this.errorTimeout = setTimeout(() => {
      this.clearErrorMessages();
    }, 5000);
  }

  clearErrorMessages(): void {
    this.errorMessages = [];
  }
}
