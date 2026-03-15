import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { PerfilUsuario } from './models/usuario.model';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'registrar', 
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'redefinir-senha',
    loadComponent: () => import('./components/auth/redefinir-senha/redefinir-senha.component').then(m => m.RedefinirSenhaComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'assuntos', 
    loadComponent: () => import('./components/assunto/assunto-list/assunto-list.component').then(m => m.AssuntoListComponent)
  },
  { 
    path: 'assuntos/novo', 
    loadComponent: () => import('./components/assunto/assunto-form/assunto-form.component').then(m => m.AssuntoFormComponent)
  },
  { 
    path: 'assuntos/:id', 
    loadComponent: () => import('./components/assunto/assunto-form/assunto-form.component').then(m => m.AssuntoFormComponent)
  },
  { 
    path: 'atendimentos', 
    loadComponent: () => import('./components/atendimento/atendimento-list/atendimento-list.component').then(m => m.AtendimentoListComponent)
  },
  { 
    path: 'atendimentos/novo', 
    loadComponent: () => import('./components/atendimento/atendimento-form/atendimento-form.component').then(m => m.AtendimentoFormComponent)
  },
  { 
    path: 'atendimentos/:id', 
    loadComponent: () => import('./components/atendimento/atendimento-form/atendimento-form.component').then(m => m.AtendimentoFormComponent)
  },
  { 
    path: 'atendimentos/:id/detalhe', 
    loadComponent: () => import('./components/atendimento/atendimento-detail/atendimento-detail.component').then(m => m.AtendimentoDetailComponent)
  },
  { 
    path: 'cas', 
    loadComponent: () => import('./components/ca/ca-list/ca-list.component').then(m => m.CaListComponent)
  },
  { 
    path: 'cas/:id/detalhe', 
    loadComponent: () => import('./components/ca/ca-detail/ca-detail.component').then(m => m.CaDetailComponent)
  },
  { 
    path: 'clientes', 
    loadComponent: () => import('./components/cliente/cliente-list/cliente-list.component').then(m => m.ClienteListComponent)
  },
  { 
    path: 'clientes/:id/detalhe', 
    loadComponent: () => import('./components/cliente/cliente-detail/cliente-detail.component').then(m => m.ClienteDetailComponent)
  },
  { 
    path: 'modulos', 
    loadComponent: () => import('./components/modulo/modulo-list/modulo-list.component').then(m => m.ModuloListComponent)
  },
  { 
    path: 'modulos/novo', 
    loadComponent: () => import('./components/modulo/modulo-form/modulo-form.component').then(m => m.ModuloFormComponent)
  },
  { 
    path: 'modulos/:id', 
    loadComponent: () => import('./components/modulo/modulo-form/modulo-form.component').then(m => m.ModuloFormComponent)
  },
  { 
    path: 'sugestoes', 
    loadComponent: () => import('./components/sugestao/sugestao-list/sugestao-list.component').then(m => m.SugestaoListComponent)
  },
  { 
    path: 'sugestoes/novo', 
    loadComponent: () => import('./components/sugestao/sugestao-form/sugestao-form.component').then(m => m.SugestaoFormComponent)
  },
  { 
    path: 'sugestoes/:id', 
    loadComponent: () => import('./components/sugestao/sugestao-form/sugestao-form.component').then(m => m.SugestaoFormComponent)
  },
  { 
    path: 'tipos-atendimento', 
    loadComponent: () => import('./components/tipo-atendimento/tipo-atendimento-list/tipo-atendimento-list.component').then(m => m.TipoAtendimentoListComponent)
  },
  { 
    path: 'tipos-atendimento/novo', 
    loadComponent: () => import('./components/tipo-atendimento/tipo-atendimento-form/tipo-atendimento-form.component').then(m => m.TipoAtendimentoFormComponent)
  },
  { 
    path: 'tipos-atendimento/:id', 
    loadComponent: () => import('./components/tipo-atendimento/tipo-atendimento-form/tipo-atendimento-form.component').then(m => m.TipoAtendimentoFormComponent)
  },
  { 
    path: 'usuarios', 
    loadComponent: () => import('./components/usuario/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent),
    canActivate: [authGuard],
    data: { roles: [PerfilUsuario.Administrador, PerfilUsuario.Gerente] }
  },
  { 
    path: 'usuarios/novo', 
    loadComponent: () => import('./components/usuario/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent),
    canActivate: [authGuard],
    data: { roles: [PerfilUsuario.Administrador, PerfilUsuario.Gerente] }
  },
  { 
    path: 'usuarios/:id', 
    loadComponent: () => import('./components/usuario/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent),
    canActivate: [authGuard],
    data: { roles: [PerfilUsuario.Administrador, PerfilUsuario.Gerente] }
  },
  { path: '**', redirectTo: '/dashboard' }
];
