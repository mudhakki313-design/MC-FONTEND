import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  AuthService,
  LoginRequest
} from '../../services/auth.service';

import {
  AlertService
} from '../../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  // ==========================================
  // FORM DATA
  // ==========================================

  username = '';

  password = '';

  rememberMe = false;

  showPassword = false;

  loading = false;

  errorMessage = '';


  constructor(
    private authService: AuthService,
    private alert: AlertService,
    private router: Router
  ) {}


  // ==========================================
  // LOGIN
  // ==========================================

  login(): void {

    this.errorMessage = '';


    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!this.username.trim()) {

      this.errorMessage =
        'Please enter your username.';

      this.alert.warning(
        'Username Required',
        'Please enter your username.'
      );

      return;
    }


    if (!this.password.trim()) {

      this.errorMessage =
        'Please enter your password.';

      this.alert.warning(
        'Password Required',
        'Please enter your password.'
      );

      return;
    }


    const request: LoginRequest = {

      username: this.username.trim(),

      password: this.password

    };


    this.loading = true;


    // ==========================================
    // CALL BACKEND
    // ==========================================

    this.authService
      .login(request)
      .subscribe({

        // ======================================
        // SUCCESS
        // ======================================

        next: (response) => {

          this.loading = false;

          this.errorMessage = '';


          this.alert.success(
            'Login Successful',
            `Welcome back, ${response.fullName}.`
          );


          this.navigateByRole(
            response.role
          );

        },


        // ======================================
        // ERROR
        // ======================================

        error: (error) => {

          this.loading = false;


          console.error(
            'Login error:',
            error
          );


          this.errorMessage =
            this.getErrorMessage(error);


          this.alert.error(
            'Login Failed',
            this.errorMessage
          );

        }

      });

  }


  // ==========================================
  // ERROR MESSAGE
  // ==========================================

  private getErrorMessage(
    error: any
  ): string {

    if (
      error?.error?.message
    ) {

      return error.error.message;

    }


    if (
      error?.status === 401
    ) {

      return 'Invalid username or password.';

    }


    if (
      error?.status === 403
    ) {

      return 'You are not authorized to access the system.';

    }


    if (
      error?.status === 0
    ) {

      return 'Unable to connect to the server. Please check that the backend is running.';

    }


    return 'Login failed. Please try again.';

  }


  // ==========================================
  // ROLE NAVIGATION
  // ==========================================

  private navigateByRole(
    role: string
  ): void {

    switch (role) {

      // --------------------------------------
      // ASSOCIATION
      // --------------------------------------

      case 'ROLE_ASSOCIATION':

        this.router.navigate([
          '/association/dashboard'
        ]);

        break;


      // --------------------------------------
      // MADRASA
      // --------------------------------------

      case 'ROLE_MADRASA':

        this.router.navigate([
          '/madrasa/dashboard'
        ]);

        break;


      // --------------------------------------
      // CHIEF JUDGE
      // --------------------------------------

      case 'ROLE_CHIEF_JUDGE':

        this.router.navigate([
          '/chief/dashboard'
        ]);

        break;


      // --------------------------------------
      // JUDGE
      // --------------------------------------

      case 'ROLE_JUDGE':

        this.router.navigate([
          '/judge/dashboard'
        ]);

        break;


      // --------------------------------------
      // UNKNOWN ROLE
      // --------------------------------------

      default:

        this.authService.logout();

        this.alert.error(
          'Access Denied',
          'Your account does not have a valid system role.'
        );

        this.router.navigate([
          '/login'
        ]);

        break;

    }

  }


  // ==========================================
  // PASSWORD VISIBILITY
  // ==========================================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }


  // ==========================================
  // QUICK MADRASA LOGIN
  // ==========================================

  loginAsMadrasa(): void {

    /*
     * This method exists because your current
     * login.html contains a quick-login button.
     *
     * We only pre-fill the credentials.
     * The actual login still goes through
     * the normal backend authentication.
     */

    this.username = 'MDR001';

    this.password = 'MDR001@2026';

    this.errorMessage = '';

  }

}