import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,

  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

  sidebarCollapsed = false;
  mobileSidebarOpen = false;

  username = '';
  fullName = '';
  role = 'Association';


  constructor(
    private router: Router
  ) {

    this.loadUser();

  }


  // =====================================
  // USER
  // =====================================

  private loadUser(): void {

    this.username =
      localStorage.getItem('username') ?? '';

    this.fullName =
      localStorage.getItem('fullName') ??
      this.username;

    const storedRole =
      localStorage.getItem('role');

    if (storedRole) {

      this.role =
        storedRole
          .replace('ROLE_', '')
          .replace('_', ' ');

    }

  }


  // =====================================
  // DESKTOP SIDEBAR
  // =====================================

  toggleSidebar(): void {

    this.sidebarCollapsed =
      !this.sidebarCollapsed;

  }


  // =====================================
  // MOBILE SIDEBAR
  // =====================================

  openMobileSidebar(): void {

    this.mobileSidebarOpen = true;

  }


  closeMobileSidebar(): void {

    this.mobileSidebarOpen = false;

  }


  // =====================================
  // MOBILE NAVIGATION
  // =====================================

  navigateMobile(): void {

    this.closeMobileSidebar();

  }


  // =====================================
  // LOGOUT
  // =====================================

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);

  }

}