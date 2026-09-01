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

import {
  MadrasaService,
  Madrasa
} from '../../services/madrasa.service';


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


  // =====================================================
  // SIDEBAR
  // =====================================================

  sidebarOpen = false;


  // =====================================================
  // PROFILE
  // =====================================================

  profile: UserProfile | null = null;


  // =====================================================
  // MADRASA
  // =====================================================

  madrasa: Madrasa | null = null;


  // =====================================================
  // DISPLAY
  // =====================================================

  displayName = 'Madrasa';


  username = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private authService:
      AuthService,

    private userService:
      UserService,

    private madrasaService:
      MadrasaService,

    private router:
      Router

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    const user =
      this.authService.getUser();


    if (user) {

      this.username =
        user.username || '';

    }


    this.loadProfile();

    this.loadMyMadrasa();

  }


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  loadProfile(): void {

    this.userService
      .getMyProfile()
      .subscribe({

        next: profile => {

          this.profile = profile;

          /*
           * IMPORTANT:
           *
           * Do NOT use profile.fullName here.
           *
           * For Madrasa accounts, fullName is
           * the contact person / Sheikh.
           */

        },

        error: error => {

          console.error(
            'Failed to load madrasa profile:',
            error
          );

        }

      });

  }


  // =====================================================
  // LOAD MY MADRASA
  // =====================================================

  loadMyMadrasa(): void {

    this.madrasaService
      .getMyMadrasa()
      .subscribe({

        next: madrasa => {

          this.madrasa =
            madrasa;


          if (
            madrasa?.name?.trim()
          ) {

            this.displayName =
              madrasa.name.trim();

          }

        },

        error: error => {

          console.error(
            'Failed to load my madrasa:',
            error
          );

          /*
           * Do not replace the madrasa name
           * with Sheikh/contact person.
           *
           * Keep the neutral fallback.
           */

          this.displayName =
            'Madrasa';

        }

      });

  }


  // =====================================================
  // INITIALS
  // =====================================================

  get initials(): string {

    const name =
      this.displayName?.trim();


    if (!name) {

      return 'M';

    }


    const parts =
      name.split(/\s+/);


    if (
      parts.length === 1
    ) {

      return parts[0]
        .substring(0, 2)
        .toUpperCase();

    }


    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();

  }


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  get profileImageUrl(): string | null {

    return (
      this.profile?.profileImage ??
      null
    );

  }


  // =====================================================
  // TOGGLE SIDEBAR
  // =====================================================

  toggleSidebar(): void {

    this.sidebarOpen =
      !this.sidebarOpen;

  }


  // =====================================================
  // CLOSE SIDEBAR
  // =====================================================

  closeSidebar(): void {

    this.sidebarOpen = false;

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    this.authService.logout();

    this.closeSidebar();

    this.router.navigate([
      '/login'
    ]);

  }

}