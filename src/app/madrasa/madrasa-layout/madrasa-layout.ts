import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import {
  AuthService
} from '../../services/auth.service';

import {
  UserService,
  UserProfile
} from '../../services/user.service';


@Component({

  selector: 'app-madrasa-layout',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],

  templateUrl: './madrasa-layout.html',

  styleUrl: './madrasa-layout.css'

})
export class MadrasaLayout
  implements OnInit {


  // ==========================================
  // SIDEBAR
  // ==========================================

  sidebarOpen = false;


  // ==========================================
  // USER
  // ==========================================

  profile: UserProfile | null = null;


  displayName = 'Madrasa User';

  username = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private authService: AuthService,

    private userService: UserService,

    private router: Router

  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    const user =
      this.authService.getUser();

    if (user) {

      this.displayName =
        user.fullName || user.username;

      this.username =
        user.username;

    }


    this.loadProfile();

  }


  // ==========================================
  // LOAD PROFILE
  // ==========================================

  loadProfile(): void {

    this.userService
      .getMyProfile()
      .subscribe({

        next: profile => {

          this.profile = profile;

          this.displayName =
            profile.fullName ||
            profile.username;

        },

        error: error => {

          console.error(
            'Failed to load madrasa profile:',
            error
          );

        }

      });

  }


  // ==========================================
  // INITIALS
  // ==========================================

  get initials(): string {

    const name =
      this.displayName?.trim();

    if (!name) {

      return 'M';

    }


    const parts =
      name.split(/\s+/);


    if (parts.length === 1) {

      return parts[0]
        .substring(0, 2)
        .toUpperCase();

    }


    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();

  }


  // ==========================================
  // PROFILE IMAGE
  // ==========================================

  get profileImageUrl(): string | null {

    return this.profile?.profileImage ?? null;

  }


  // ==========================================
  // TOGGLE SIDEBAR
  // ==========================================

  toggleSidebar(): void {

    this.sidebarOpen =
      !this.sidebarOpen;

  }


  // ==========================================
  // CLOSE SIDEBAR
  // ==========================================

  closeSidebar(): void {

    this.sidebarOpen = false;

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    this.authService.logout();

    this.closeSidebar();

    this.router.navigate([
      '/login'
    ]);

  }

}