import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsuarioService } from '../../../services/usuario.service';
import { TrocarSenha } from '../../../models/usuario.model';

@Component({
  selector: 'app-trocar-senha-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './trocar-senha-dialog.component.html',
  styleUrl: './trocar-senha-dialog.component.scss'
})
export class TrocarSenhaDialogComponent {
  form: FormGroup;
  loading = false;
  hideSenhaAtual = true;
  hideNovaSenha = true;
  hideConfirmaSenha = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TrocarSenhaDialogComponent>,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { usuarioId: number }
  ) {
    this.form = this.fb.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const senha = control.get('novaSenha');
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

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const dto: TrocarSenha = {
        usuarioId: this.data.usuarioId,
        senhaAtual: this.form.value.senhaAtual,
        novaSenha: this.form.value.novaSenha,
        confirmaSenha: this.form.value.confirmaSenha
      };

      this.usuarioService.trocarSenha(dto).subscribe({
        next: () => {
          this.snackBar.open('Senha alterada com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          const mensagem = err.error?.message || 'Erro ao alterar senha. Verifique sua senha atual.';
          this.snackBar.open(mensagem, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
