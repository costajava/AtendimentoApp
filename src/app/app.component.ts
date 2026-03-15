import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Usuario, PerfilUsuario } from './models/usuario.model';
import { TrocarSenhaDialogComponent } from './components/usuario/trocar-senha-dialog/trocar-senha-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  
  title = 'Controle de Atendimento';
  usuarioLogado: Usuario | null = null;
  isAuthenticated = false;

  menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard', roles: [] },
    { path: '/atendimentos', icon: 'support_agent', label: 'Atendimentos', roles: [] },
    { path: '/clientes', icon: 'people', label: 'Clientes', roles: [] },
    { path: '/usuarios', icon: 'person', label: 'Usuários', roles: [PerfilUsuario.Administrador, PerfilUsuario.Gerente] },
    { path: '/assuntos', icon: 'topic', label: 'Assuntos', roles: [] },
    { path: '/tipos-atendimento', icon: 'category', label: 'Tipos de Atendimento', roles: [PerfilUsuario.Administrador, PerfilUsuario.Gerente] },
    { path: '/modulos', icon: 'extension', label: 'Módulos', roles: [PerfilUsuario.Administrador, PerfilUsuario.Gerente] },
    { path: '/cas', icon: 'bug_report', label: 'CAs', roles: [] },
    { path: '/sugestoes', icon: 'lightbulb', label: 'Sugestões', roles: [] }
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.usuarioLogado$.subscribe(usuario => {
      this.usuarioLogado = usuario;
      this.isAuthenticated = this.authService.isAutenticado();
    });
  }

  podeVerMenuItem(item: any): boolean {
    if (!item.roles || item.roles.length === 0) return true;
    return this.authService.temQualquerPermissao(item.roles);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getPerfilNome(perfil: PerfilUsuario): string {
    switch (perfil) {
      case PerfilUsuario.Administrador: return 'Administrador';
      case PerfilUsuario.Gerente: return 'Gerente';
      case PerfilUsuario.Atendente: return 'Atendente';
      default: return '';
    }
  }

  trocarSenha(): void {
    if (this.usuarioLogado) {
      this.dialog.open(TrocarSenhaDialogComponent, {
        width: '400px',
        data: { usuarioId: this.usuarioLogado.id }
      });
    }
  }
}
