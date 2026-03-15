import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../models/dashboard.model';
import { AuthService } from '../../services/auth.service';
import { Usuario, PerfilUsuario } from '../../models/usuario.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  cards = [
    { title: 'Atendimentos', icon: 'support_agent', count: 0, link: '/atendimentos', color: 'bg-blue-500' },
    { title: 'Clientes', icon: 'people', count: 0, link: '/clientes', color: 'bg-green-500' },
    { title: 'Usuários', icon: 'person', count: 0, link: '/usuarios', color: 'bg-purple-500' },
    { title: 'CAs', icon: 'bug_report', count: 0, link: '/cas', color: 'bg-red-500' },
    { title: 'Sugestões', icon: 'lightbulb', count: 0, link: '/sugestoes', color: 'bg-yellow-500' },
    { title: 'Módulos', icon: 'extension', count: 0, link: '/modulos', color: 'bg-indigo-500' },
    { title: 'Assuntos', icon: 'topic', count: 0, link: '/assuntos', color: 'bg-teal-500' },
    { title: 'Tipos de Atendimento', icon: 'category', count: 0, link: '/tipos-atendimento', color: 'bg-pink-500' }
  ];

  constructor(private dashboardService: DashboardService, public authService: AuthService) {}

  ngOnInit(): void {
    const semLink = '#';
    const usuarioLogado = this.authService.getUsuarioLogado();
    const perfilUsuario = usuarioLogado?.perfil;

    this.dashboardService.getDados().subscribe({
      next: (dados: Dashboard) => {

        this.cards.forEach(card => {
          switch (card.title) {
            case 'Atendimentos':
              card.count = dados.totalAtendimento;
              break;
            case 'Clientes':
              card.count = dados.totalCliente;
              break;
            case 'Usuários':
              card.count = dados.totalUsuario;
              if (perfilUsuario === PerfilUsuario.Atendente) {
                 card.link = semLink;
              }
              break;
            case 'CAs':
              card.count = dados.totalCa;
              break;
            case 'Sugestões':
              card.count = dados.totalSugestao;
              break;
            case 'Módulos':
             card.count = dados.totalModulo;
              if (perfilUsuario === PerfilUsuario.Atendente) {
                 card.link = semLink;
              }
             break;
            case 'Assuntos':
              card.count = dados.totalAssunto;
              break;
            case 'Tipos de Atendimento':
              card.count = dados.totalTipoAtendimento;
              if (perfilUsuario === PerfilUsuario.Atendente) {
                 card.link = semLink;
              }
              break;
          }
        });

      },
      error: () => {
        console.error('Erro ao carregar dados do dashboard');
      }
    });
  }
}
