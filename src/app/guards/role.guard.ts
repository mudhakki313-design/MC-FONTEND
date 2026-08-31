import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';


export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);


  // ==========================================
  // CHECK LOGIN
  // ==========================================

  if (!authService.isLoggedIn()) {

    return router.createUrlTree([
      '/login'
    ]);

  }


  // ==========================================
  // GET CURRENT ROLE
  // ==========================================

  const currentRole =
    authService.getRole();


  // ==========================================
  // GET ALLOWED ROLES FROM ROUTE
  // ==========================================

  const allowedRoles =
    route.data?.['roles'] as string[] | undefined;


  // ==========================================
  // NO ROLE CONFIGURATION
  // ==========================================

  if (
    !allowedRoles ||
    allowedRoles.length === 0
  ) {

    return true;

  }


  // ==========================================
  // CHECK ROLE
  // ==========================================

  if (
    currentRole &&
    allowedRoles.includes(currentRole)
  ) {

    return true;

  }


  // ==========================================
  // WRONG ROLE
  // ==========================================

  console.warn(
    'Unauthorized route access:',
    {
      currentRole,
      allowedRoles,
      requestedUrl: state.url
    }
  );


  // ==========================================
  // SEND USER TO THEIR OWN DASHBOARD
  // ==========================================

  switch (currentRole) {

    case 'ROLE_ASSOCIATION':

      return router.createUrlTree([
        '/association/dashboard'
      ]);


    case 'ROLE_MADRASA':

      return router.createUrlTree([
        '/madrasa/dashboard'
      ]);


    case 'ROLE_JUDGE':

      return router.createUrlTree([
        '/judge/dashboard'
      ]);


    case 'ROLE_CHIEF_JUDGE':

      return router.createUrlTree([
        '/chief/dashboard'
      ]);


    default:

      authService.logout();

      return router.createUrlTree([
        '/login'
      ]);

  }

};