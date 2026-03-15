import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SugestaoService } from '../../../services/sugestao.service';
import { Sugestao } from '../../../models/sugestao.model';

@Component({
  selector: 'app-sugestao-create-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './sugestao-create-dialog.component.html'
})
export class SugestaoCreateDialogComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private sugestaoService: SugestaoService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<SugestaoCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}
  ) {
    this.form = this.fb.group({
      id: [0],
      descricao: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      const sugestao: Sugestao = this.form.value;
      this.sugestaoService.create(sugestao).subscribe({
        next: (created) => {
          this.snackBar.open('Sugestão criada com sucesso', 'Fechar', { duration: 3000 });
          this.dialogRef.close(created);
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Erro ao criar sugestão', 'Fechar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}