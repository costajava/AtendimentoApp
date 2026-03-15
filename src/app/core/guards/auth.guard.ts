import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PerfilUsuario } from '../../models/usuario.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAutenticado()) {
    router.navigate(['/login']);
    return false;
  }

  const roles = route.data['roles'] as PerfilUsuario[];
  if (roles && !authService.temQualquerPermissao(roles)) {
    router.navigate(['/acesso-negado']);
    return false;
  }

  return true;
};
