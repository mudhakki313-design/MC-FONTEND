import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Madrasa,
  MadrasaRequest,
  MadrasaService
} from '../../services/madrasa.service';

import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-madrasas',
  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './madrasas.html',
  styleUrl: './madrasas.css'
})
export class Madrasas implements OnInit {

  madrasas: Madrasa[] = [];

  loading = false;
  saving = false;

  showForm = false;

  editingId: number | null = null;


  form: MadrasaRequest = {

    name: '',
    registrationNumber: '',
    district: '',
    region: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    status: 'ACTIVE'

  };


  constructor(
    private madrasaService: MadrasaService,
    private alert: AlertService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.loadMadrasas();

  }


  // =====================================
  // LOAD MADRASAS
  // =====================================

  loadMadrasas(): void {

    this.loading = true;

    this.madrasaService
      .getAllMadrasas()
      .subscribe({

        next: (data) => {

          this.madrasas = data;

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          this.loading = false;

          console.error('Load Madrasas Error:', error);

          this.alert.error(
            'Failed to Load',
            this.getErrorMessage(
              error,
              'Unable to load madrasa records.'
            )
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================
  // CREATE
  // =====================================

  openCreate(): void {

    this.editingId = null;

    this.resetForm();

    this.showForm = true;

  }


  // =====================================
  // EDIT
  // =====================================

  openEdit(madrasa: Madrasa): void {

    this.editingId = madrasa.id;

    this.form = {

      name: madrasa.name,

      registrationNumber:
        madrasa.registrationNumber,

      district:
        madrasa.district,

      region:
        madrasa.region,

      contactPerson:
        madrasa.contactPerson,

      phone:
        madrasa.phone,

      email:
        madrasa.email,

      address:
        madrasa.address,

      status:
        madrasa.status

    };

    this.showForm = true;

  }


  // =====================================
  // CLOSE
  // =====================================

  closeForm(): void {

    this.showForm = false;

    this.editingId = null;

    this.resetForm();

    this.saving = false;

  }


  // =====================================
  // SAVE
  // =====================================

  save(): void {

    if (this.saving) {
      return;
    }


    this.saving = true;


    // =====================================
    // UPDATE
    // =====================================

    if (this.editingId !== null) {

      this.madrasaService
        .updateMadrasa(
          this.editingId,
          this.form
        )
        .subscribe({

          next: () => {

            this.saving = false;

            this.alert.success(
              'Madrasa Updated',
              'Madrasa information updated successfully.'
            );

            this.closeForm();

            this.loadMadrasas();

          },

          error: (error) => {

            this.saving = false;

            this.showError(error);

            this.cdr.detectChanges();

          }

        });

      return;

    }


    // =====================================
    // CREATE
    // =====================================

    this.madrasaService
      .createMadrasa(this.form)
      .subscribe({

        next: () => {

          this.saving = false;

          this.alert.success(
            'Madrasa Registered',
            'Madrasa has been registered successfully.'
          );

          this.closeForm();

          this.loadMadrasas();

        },

        error: (error) => {

          // MUHIMU:
          // hata duplicate ikiwa imetokea,
          // loading button lazima isimame.

          this.saving = false;

          this.showError(error);

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================
  // DEACTIVATE
  // =====================================

  deactivate(madrasa: Madrasa): void {

    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${madrasa.name}?`
    );

    if (!confirmed) {
      return;
    }


    this.madrasaService
      .deactivateMadrasa(madrasa.id)
      .subscribe({

        next: () => {

          this.alert.success(
            'Madrasa Deactivated',
            'The madrasa has been deactivated successfully.'
          );

          this.loadMadrasas();

        },

        error: (error) => {

          this.showError(error);

        }

      });

  }


  // =====================================
  // RESET FORM
  // =====================================

  private resetForm(): void {

    this.form = {

      name: '',
      registrationNumber: '',
      district: '',
      region: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      status: 'ACTIVE'

    };

  }


  // =====================================
  // ERROR HANDLER
  // =====================================

  private showError(error: any): void {

    console.error('Madrasa Operation Error:', error);


    const message = this.getErrorMessage(
      error,
      'Something went wrong. Please try again.'
    );


    // =====================================
    // DUPLICATE REGISTRATION NUMBER
    // =====================================

    if (
      message
        .toLowerCase()
        .includes('registration number already exists')
    ) {

      this.alert.error(
        'Registration Number Exists',
        'This registration number is already registered.'
      );

      return;

    }


    // =====================================
    // DUPLICATE EMAIL
    // =====================================

    if (
      message
        .toLowerCase()
        .includes('email already exists')
    ) {

      this.alert.error(
        'Email Already Exists',
        'This email address is already registered.'
      );

      return;

    }


    // =====================================
    // GENERAL ERROR
    // =====================================

    this.alert.error(
      'Operation Failed',
      message
    );

  }


  // =====================================
  // GET BACKEND ERROR MESSAGE
  // =====================================

  private getErrorMessage(
    error: any,
    fallback: string
  ): string {

    /*
     * Spring Boot ResponseStatusException
     * mara nyingi inakuja kama:
     *
     * {
     *   status: 400,
     *   error: "Bad Request",
     *   message: "Registration number already exists."
     * }
     */


    if (error?.error?.message) {

      return error.error.message;

    }


    // Wakati mwingine interceptor/backend
    // inaweza kurudisha error ikiwa string.

    if (typeof error?.error === 'string') {

      return error.error;

    }


    if (error?.message) {

      return error.message;

    }


    return fallback;

  }


  // =====================================
  // COUNTERS
  // =====================================

  get activeCount(): number {

    return this.madrasas.filter(
      madrasa =>
        madrasa.status === 'ACTIVE'
    ).length;

  }


  get inactiveCount(): number {

    return this.madrasas.filter(
      madrasa =>
        madrasa.status === 'INACTIVE'
    ).length;

  }

}