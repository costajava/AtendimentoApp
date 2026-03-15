import { Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // 👈 Adicionado DatePipe
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AssuntoCreateDialogComponent } from '../../assunto/assunto-create-dialog/assunto-create-dialog.component';
import { SugestaoCreateDialogComponent } from '../../sugestao/sugestao-create-dialog/sugestao-create-dialog.component';
import { DateMaskDirective } from '../../../directives/date-mask.directive';
import { PtBrDateAdapter } from '../../../core/pt-br-date-adapter';
import { CUSTOM_DATE_FORMATS } from '../../../app.config';
import { AtendimentoService } from '../../../services/atendimento.service';
// ... Outros imports de Services e Models mantidos ...
import { ClienteService } from '../../../services/cliente.service';
import { UsuarioService } from '../../../services/usuario.service';
import { AssuntoService } from '../../../services/assunto.service';
import { TipoAtendimentoService } from '../../../services/tipo-atendimento.service';
import { ModuloService } from '../../../services/modulo.service';
import { CaService } from '../../../services/ca.service';
import { SugestaoService } from '../../../services/sugestao.service';
import { AuthService } from '../../../services/auth.service';
import { Atendimento } from '../../../models/atendimento.model';
import { Cliente } from '../../../models/cliente.model';
import { Usuario } from '../../../models/usuario.model';
import { Assunto } from '../../../models/assunto.model';
import { TipoAtendimento } from '../../../models/tipo-atendimento.model';
import { Modulo } from '../../../models/modulo.model';
import { Ca } from '../../../models/ca.model';
import { Sugestao } from '../../../models/sugestao.model';

@Component({
  selector: 'app-atendimento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatSlideToggleModule, MatSnackBarModule, MatIconModule, MatDialogModule, DateMaskDirective],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: PtBrDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ], 
  templateUrl: './atendimento-form.component.html',
  styleUrl: './atendimento-form.component.scss'
})
export class AtendimentoFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('primeiroCampo') primeiroCampo!: ElementRef;
  
  form: FormGroup;
  isEditMode = false;
  atendimentoId?: number;
  loading = false;
  errorMessages: string[] = [];
  private errorTimeout: any;
  
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  usuarios: Usuario[] = [];
  assuntos: Assunto[] = [];
  tiposAtendimento: TipoAtendimento[] = [];
  modulos: Modulo[] = [];
  cas: Ca[] = [];
  sugestoes: Sugestao[] = [];
  caCodigoInput: number | null = null;
  clienteCodigoInput: number | null = null;

  constructor(
    private fb: FormBuilder,
    private atendimentoService: AtendimentoService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private assuntoService: AssuntoService,
    private tipoAtendimentoService: TipoAtendimentoService,
    private moduloService: ModuloService,
    private caService: CaService,
    private sugestaoService: SugestaoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private authService: AuthService,
    private datePipe: DatePipe 
  ) {
    this.form = this.fb.group({
      id: [0],
      caId: [null, Validators.required],
      caCompartilhadaId: [null],
      clienteId: [null],
      contato: ['', Validators.required],
      tipoAtendimentoId: [0, Validators.required],
      dataAtendimento: [new Date(), Validators.required],
      horaInicio: ['', Validators.required],
      horaFim: [''],
      moduloId: [0, Validators.required],
      assuntoId: [0, Validators.required],
      cobrarCliente: [false],
      atendimentoConcluido: [0, Validators.required],
      sugestaoId: [null, Validators.required],
      observacoes: [null],
      usuarioId: [0, Validators.required]
    });

    // Mantém caCompartilhadaId apenas como display: impede interação do usuário
    this.form.get('caCompartilhadaId')?.disable({ emitEvent: false });
  }

  ngOnInit(): void {
    this.loadDependencies();
    this.setupCaChangeListener();
    this.setupClienteChangeListener();
    this.setupCaIdFormListener();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.atendimentoId = +id;
      this.loadAtendimento(this.atendimentoId);
    } else {
      const usuarioLogado = this.authService.getUsuarioLogado();
      if (usuarioLogado) {
        setTimeout(() => {
          this.form.patchValue({ 
            moduloId: usuarioLogado.moduloId || 0,
            usuarioId: usuarioLogado.id
          });
        }, 0);
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.primeiroCampo && this.primeiroCampo.nativeElement) {
        this.primeiroCampo.nativeElement.focus();
      }
    }, 100);
  }

  onHoraInicioFocus(): void {
    if (!this.form.get('horaInicio')?.value) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      this.form.patchValue({
        horaInicio: `${hours}:${minutes}`
      });
    }
  }

  loadDependencies(): void {
    this.clienteService.getAll().subscribe(data => {
      this.clientes = data;
      this.filterClientesByCa();
      // Garante caCompartilhadaId correto quando carregando edição
      const currentClienteId = this.form.get('clienteId')?.value as number | null | undefined;
      this.syncCaCompartilhadaByClienteId(currentClienteId);
    });
    this.usuarioService.getAll().subscribe(data => this.usuarios = data);
    this.assuntoService.getAll().subscribe(data => this.assuntos = data);
    this.tipoAtendimentoService.getAll().subscribe(data => this.tiposAtendimento = data);
    this.moduloService.getAll().subscribe(data => this.modulos = data);
    this.caService.getAll().subscribe(data => this.cas = data);
    this.sugestaoService.getAll().subscribe(data => {
      this.sugestoes = data;
      this.setDefaultSugestaoIfApplicable();
    });
  }

  openAssuntoDialog(): void {
    const moduloIdAtual = this.form.get('moduloId')?.value as number;
    const dialogRef = this.dialog.open(AssuntoCreateDialogComponent, { data: { moduloId: moduloIdAtual }, width: '600px' });

    dialogRef.afterClosed().subscribe((created: Assunto | undefined) => {
      if (created && created.id) {
        this.assuntos = [...this.assuntos, created];
        this.form.patchValue({ assuntoId: created.id });
        this.snackBar.open('Assunto adicionado e selecionado', 'Fechar', { duration: 3000 });
      }
    });
  }

  private normalizeText(text: string): string {
    return (text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();
  }

  private setDefaultSugestaoIfApplicable(): void {
    if (this.isEditMode) return;
    const current = this.form.get('sugestaoId')?.value;
    if (current) return; // já possui valor

    const alvo = this.normalizeText('NAO SE APLICA');
    const encontrada = this.sugestoes.find(s => this.normalizeText(s.descricao) === alvo);
    if (encontrada && encontrada.id) {
      this.form.patchValue({ sugestaoId: encontrada.id });
    }
  }

  openSugestaoDialog(): void {
    const dialogRef = this.dialog.open(SugestaoCreateDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((created: Sugestao | undefined) => {
      if (created && created.id) {
        this.sugestoes = [...this.sugestoes, created];
        this.form.patchValue({ sugestaoId: created.id });
        this.snackBar.open('Sugestão criada e selecionada', 'Fechar', { duration: 3000 });
      }
    });
  }

  loadAtendimento(id: number): void {
    this.loading = true;
    this.atendimentoService.getById(id).subscribe({
      next: (response) => {
        if (response.sucesso && response.dados) {
          const dados = response.dados as any;
          const dataAt = this.parseDateFromDto(dados.dataAtendimento);
          const horaIni = this.toHHmm(dados.horaInicial || dados.horaInicio);
          const horaFim = this.toHHmm(dados.horaFinal || dados.horaFim);
          
          this.form.patchValue({
            ...dados,
            dataAtendimento: dataAt ?? new Date(), 
            horaInicio: horaIni ?? '',
            horaFim: horaFim ?? ''
          });

          // Em modo edição, sincroniza caCompartilhadaId com base no cliente
          const clienteIdAtual = (dados.clienteId as number | null | undefined);
          this.syncCaCompartilhadaByClienteId(clienteIdAtual);
          if (response.mensagem) {
            this.snackBar.open(response.mensagem, 'Fechar', { duration: 3000 });
          }
        } else {
          this.snackBar.open(response.mensagem || 'Erro ao carregar atendimento', 'Fechar', { duration: 3000 });
          this.router.navigate(['/atendimentos']);
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar atendimento', 'Fechar', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/atendimentos']);
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

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.clearErrorMessages();
      
      const formValue = this.form.value;
      const horaFinalFmt = this.formatTimeToHms(formValue.horaFim as string);
      const atendimento: any = {
        ...formValue,
        dataAtendimento: this.formatDateOnly(formValue.dataAtendimento as Date),
        horaInicial: this.formatTimeToHms(formValue.horaInicio as string),
        horaFinal: horaFinalFmt
      };
      
      delete (atendimento as any).horaInicio;
      delete (atendimento as any).horaFim;
      delete (atendimento as any).caCompartilhadaId;

      // Remove horaFinal do payload se não informado (deixa como não obrigatório)
      if (horaFinalFmt === null) {
        delete atendimento.horaFinal;
      }

      const handleSuccess = () => {
        this.snackBar.open(
          this.isEditMode ? 'Atendimento atualizado com sucesso' : 'Atendimento criado com sucesso', 
          'Fechar', 
          { duration: 3000 }
        );
        this.router.navigate(['/atendimentos']);
      };

      const handleError = (error: any) => {
        this.loading = false;
        
        if (error.status === 400 && error.error?.errors) {
          const validationErrors = error.error.errors;
          this.errorMessages = (Object.values(validationErrors) as string[][])
            .flat()
            .filter((msg: string, index: number, self: string[]) => self.indexOf(msg) === index);
          
          this.setErrorTimeout();
        } else {
          this.errorMessages = [error.error?.message || 'Ocorreu um erro inesperado'];
          this.setErrorTimeout();
        }
      };

      if (this.isEditMode && this.atendimentoId) {
        this.atendimentoService.update(this.atendimentoId, atendimento).subscribe({
          next: handleSuccess,
          error: handleError
        });
      } else {
        console.log('Criando atendimento:', atendimento);
        this.atendimentoService.create(atendimento).subscribe({
          next: handleSuccess,
          error: handleError
        });
      }
    }
  }

  private formatDateOnly(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; 
  }

  private formatTimeToHms(time: string | null | undefined): string | null {
    if (!time) return null;
    const parts = time.split(':');
    if (parts.length >= 2) {
      const hh = parts[0].padStart(2, '0');
      const mm = parts[1].padStart(2, '0');
      const ss = parts.length >= 3 ? parts[2].padStart(2, '0') : '00';
      return `${hh}:${mm}:${ss}`;
    }
    return time || null;
  }

  private toHHmm(time: string | null | undefined): string | null {
    if (!time) return null;
    const parts = time.split(':');
    if (parts.length >= 2) {
      const hh = parts[0].padStart(2, '0');
      const mm = parts[1].padStart(2, '0');
      return `${hh}:${mm}`;
    }
    return null;
  }

  private parseDateFromDto(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      const dateOnly = value.split('T')[0];
      const [y, m, d] = dateOnly.split('-').map(v => parseInt(v, 10));
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        // Constrói Date no fuso local para evitar shift por timezone
        return new Date(y, m - 1, d); 
      }
    }
    return null;
  }
  
  setupCaChangeListener(): void {
    this.form.get('caId')?.valueChanges.subscribe(() => {
      this.filterClientesByCa();
      this.form.patchValue({ clienteId: null });
      this.clienteCodigoInput = null;
    });
  }

  setupClienteChangeListener(): void {
    this.form.get('clienteId')?.valueChanges.subscribe((clienteId) => {
      if (clienteId) {
        this.selectCaByCliente(clienteId);
        if (clienteId !== this.clienteCodigoInput) {
          this.clienteCodigoInput = clienteId;
        }
      } else {
        this.clienteCodigoInput = null;
        this.form.patchValue({ caCompartilhadaId: null }, { emitEvent: false });
      }
    });
  }

  setupCaIdFormListener(): void {
    this.form.get('caId')?.valueChanges.subscribe((caId) => {
      if (caId !== null && caId !== undefined && caId !== this.caCodigoInput) {
        this.caCodigoInput = caId;
      }
    });
  }

  onCaCodigoChange(codigo: number | null): void {
    if (codigo === null || codigo === undefined) {
      return;
    }

    const codigoNumerico = Number(codigo);
    if (isNaN(codigoNumerico)) {
      return;
    }
    
    const caEncontrada = this.cas.find(ca => ca.id === codigoNumerico);
    
    if (caEncontrada) {
      this.form.patchValue({ caId: caEncontrada.id });
    }
  }

  isCaCodigoValido(): boolean {
    if (this.caCodigoInput === null || this.caCodigoInput === undefined) {
      return true;
    }
    
    const codigoNumerico = Number(this.caCodigoInput);
    return this.cas.some(ca => ca.id === codigoNumerico);
  }

  onClienteCodigoChange(codigo: number | null): void {
    if (codigo === null || codigo === undefined) {
      return;
    }

    const codigoNumerico = Number(codigo);
    if (isNaN(codigoNumerico)) {
      return;
    }
    
    const clienteEncontrado = this.clientes.find(cliente => cliente.id === codigoNumerico);
    
    if (clienteEncontrado) {
      if (clienteEncontrado.caId !== null && clienteEncontrado.caId !== undefined) {
        this.form.patchValue({ caId: clienteEncontrado.caId }, { emitEvent: false });
        this.filterClientesByCa();
      }
      const caCompartilhadaId = clienteEncontrado.caCompartilhadaId ?? null;
      this.form.patchValue({ caCompartilhadaId }, { emitEvent: false });
      this.form.patchValue({ clienteId: clienteEncontrado.id }, { emitEvent: false });
    }
  }

  isClienteCodigoValido(): boolean {
    if (this.clienteCodigoInput === null || this.clienteCodigoInput === undefined) {
      return true;
    }
    
    const codigoNumerico = Number(this.clienteCodigoInput);
    return this.clientes.some(cliente => cliente.id === codigoNumerico);
  }

  selectCaByCliente(clienteId: number): void {
    const clienteSelecionado = this.clientes.find(c => c.id === clienteId);
    
    if (clienteSelecionado && clienteSelecionado.caId !== null && clienteSelecionado.caId !== undefined) {
      this.form.patchValue({ caId: clienteSelecionado.caId }, { emitEvent: false });
      this.filterClientesByCa();
    }
    const caCompartilhadaId = clienteSelecionado?.caCompartilhadaId ?? null;
    this.form.patchValue({ caCompartilhadaId }, { emitEvent: false });
  }

  private syncCaCompartilhadaByClienteId(clienteId: number | null | undefined): void {
    if (!clienteId) {
      this.form.patchValue({ caCompartilhadaId: null }, { emitEvent: false });
      return;
    }
    const cliente = this.clientes.find(c => c.id === clienteId);
    const caCompartilhadaId = cliente?.caCompartilhadaId ?? null;
    this.form.patchValue({ caCompartilhadaId }, { emitEvent: false });
  }

  filterClientesByCa(): void {
    const caIdSelecionado = this.form.get('caId')?.value;
    
    if (caIdSelecionado === null || caIdSelecionado === undefined) {
      this.clientesFiltrados = this.clientes;
    } else {
      this.clientesFiltrados = this.clientes.filter(
        cliente => cliente.caId === caIdSelecionado
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/atendimentos']);
  }

  ngOnDestroy(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }
}
