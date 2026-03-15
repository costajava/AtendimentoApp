import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssuntoService } from '../../../services/assunto.service';
import { ModuloService } from '../../../services/modulo.service';
import { Assunto } from '../../../models/assunto.model';
import { Modulo } from '../../../models/modulo.model';

@Component({
  selector: 'app-assunto-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './assunto-create-dialog.component.html',
})
export class AssuntoCreateDialogComponent implements OnInit {
  form: FormGroup;
  loading = false;
  modulos: Modulo[] = [];

  constructor(
    private fb: FormBuilder,
    private assuntoService: AssuntoService,
    private moduloService: ModuloService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AssuntoCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { moduloId?: number }
  ) {
    this.form = this.fb.group({
      id: [0],
      tipoAssunto: ['', [Validators.required, Validators.maxLength(50)]],
      moduloId: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.moduloService.getAll().subscribe({
      next: (mods) => {
        this.modulos = mods;
        const initialModuloId = this.data?.moduloId || 0;
        if (initialModuloId) {
          this.form.patchValue({ moduloId: initialModuloId });
        }
      },
      error: () => this.snackBar.open('Erro ao carregar módulos', 'Fechar', { duration: 3000 })
    });
  }

  onSubmit(): void {
    if (!this.form.valid) return;
    this.loading = true;
    const assunto: Assunto = this.form.value;
    this.assuntoService.create(assunto).subscribe({
      next: (created) => {
        this.snackBar.open('Assunto criado com sucesso', 'Fechar', { duration: 3000 });
        this.dialogRef.close(created);
      },
      error: () => {
        this.snackBar.open('Erro ao criar assunto', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}