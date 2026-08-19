import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-judge-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './judge-layout.html',
  styleUrl: './judge-layout.css',
})
export class JudgeLayout {

  sidebarOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}


  // =========================================================
  // SIDEBAR
  // =========================================================

  toggleSidebar(): void {

    this.sidebarOpen = !this.sidebarOpen;

  }


  closeSidebar(): void {

    this.sidebarOpen = false;

  }


  // =========================================================
  // USER
  // =========================================================

  get user() {

    return this.authService.getUser();

  }


  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}