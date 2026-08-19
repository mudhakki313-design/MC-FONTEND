import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chief-layout',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],

  templateUrl: './chief-layout.html',
  styleUrl: './chief-layout.css'
})
export class ChiefLayout implements OnInit {

  // =========================================================
  // SIDEBAR
  // =========================================================

  sidebarOpen = true;


  // =========================================================
  // USER
  // =========================================================

  fullName = 'Chief Judge';

  username = '';

  role = 'CHIEF_JUDGE';


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    const user =
      this.authService.getUser();

    if (user) {

      this.fullName =
        user.fullName || 'Chief Judge';

      this.username =
        user.username || '';

      this.role =
        user.role || 'CHIEF_JUDGE';

    }

  }


  // =========================================================
  // SIDEBAR TOGGLE
  // =========================================================

  toggleSidebar(): void {

    this.sidebarOpen =
      !this.sidebarOpen;

  }


  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}