import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Competition,
  CompetitionRequest,
  CompetitionService,
  CompetitionStatus
} from '../../services/competition.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({
  selector: 'app-competitions',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './competitions.html',

  styleUrl: './competitions.css'
})
export class Competitions implements OnInit {


  // =====================================
  // DATA
  // =====================================

  competitions: Competition[] = [];

  filteredCompetitions: Competition[] = [];


  // =====================================
  // STATES
  // =====================================

  loading = false;

  saving = false;

  showForm = false;


  // =====================================
  // EDIT
  // =====================================

  editingId: number | null = null;


  // =====================================
  // SEARCH / FILTER
  // =====================================

  searchTerm = '';

  selectedStatus = 'ALL';


  // =====================================
  // STATUS OPTIONS
  // =====================================

  statusOptions: CompetitionStatus[] = [

    'UPCOMING',

    'ONGOING',

    'COMPLETED'

  ];


  // =====================================
  // FORM
  // =====================================

  form: CompetitionRequest = {

    title: '',

    venue: '',

    competitionDate: '',

    status: 'UPCOMING'

  };


  constructor(

    private competitionService:
      CompetitionService,

    private alert:
      AlertService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================
  // INIT
  // =====================================

  ngOnInit(): void {

    this.loadCompetitions();

  }


  // =====================================
  // LOAD
  // =====================================

  loadCompetitions(): void {

    this.loading = true;


    this.competitionService

      .getAllCompetitions()

      .subscribe({

        next: (data) => {

          this.competitions = data;

          this.applyFilters();

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          this.loading = false;

          console.error(error);

          this.alert.error(

            'Failed to Load',

            error?.error?.message ??

            'Unable to load competitions.'

          );

        }

      });

  }


  // =====================================
  // FILTER
  // =====================================

  applyFilters(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.filteredCompetitions =

      this.competitions.filter(
        competition => {


          const matchesSearch =

            !search ||

            competition.title
              .toLowerCase()
              .includes(search) ||

            competition.venue
              .toLowerCase()
              .includes(search);


          const matchesStatus =

            this.selectedStatus === 'ALL' ||

            competition.status ===
              this.selectedStatus;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

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

  openEdit(
    competition: Competition
  ): void {

    this.editingId =
      competition.id;


    this.form = {

      title:
        competition.title,

      venue:
        competition.venue,

      competitionDate:
        competition.competitionDate,

      status:
        competition.status

    };


    this.showForm = true;

  }


  // =====================================
  // CLOSE
  // =====================================

  closeForm(): void {

    this.showForm = false;

    this.editingId = null;

    this.saving = false;

    this.resetForm();

  }


  // =====================================
  // SAVE
  // =====================================

  save(): void {

    if (this.saving) {

      return;

    }


    // =====================================
    // VALIDATION
    // =====================================

    if (!this.form.title.trim()) {

      this.alert.error(

        'Title Required',

        'Competition title is required.'

      );

      return;

    }


    if (!this.form.venue.trim()) {

      this.alert.error(

        'Venue Required',

        'Competition venue is required.'

      );

      return;

    }


    if (!this.form.competitionDate) {

      this.alert.error(

        'Date Required',

        'Competition date is required.'

      );

      return;

    }


    if (!this.form.status) {

      this.alert.error(

        'Status Required',

        'Competition status is required.'

      );

      return;

    }


    this.saving = true;


    // =====================================
    // UPDATE
    // =====================================

    if (this.editingId !== null) {

      this.competitionService

        .updateCompetition(
          this.editingId,
          this.form
        )

        .subscribe({

          next: () => {

            this.saving = false;

            this.alert.success(

              'Competition Updated',

              'Competition information has been updated successfully.'

            );

            this.closeForm();

            this.loadCompetitions();

          },

          error: (error) => {

            this.saving = false;

            this.showError(error);

          }

        });

      return;

    }


    // =====================================
    // CREATE
    // =====================================

    this.competitionService

      .createCompetition(this.form)

      .subscribe({

        next: () => {

          this.saving = false;

          this.alert.success(

            'Competition Created',

            'Competition has been created successfully.'

          );

          this.closeForm();

          this.loadCompetitions();

        },

        error: (error) => {

          this.saving = false;

          this.showError(error);

        }

      });

  }


  // =====================================
  // DELETE
  // =====================================

  deleteCompetition(
    competition: Competition
  ): void {

    const confirmed =
      window.confirm(

        `Are you sure you want to delete "${competition.title}"?`

      );


    if (!confirmed) {

      return;

    }


    this.competitionService

      .deleteCompetition(
        competition.id
      )

      .subscribe({

        next: () => {

          this.alert.success(

            'Competition Deleted',

            'Competition has been deleted successfully.'

          );

          this.loadCompetitions();

        },

        error: (error) => {

          this.showError(error);

        }

      });

  }


  // =====================================
  // RESET
  // =====================================

  private resetForm(): void {

    this.form = {

      title: '',

      venue: '',

      competitionDate: '',

      status: 'UPCOMING'

    };

  }


  // =====================================
  // ERROR
  // =====================================

  private showError(
    error: any
  ): void {

    console.error(
      'Competition Error:',
      error
    );


    this.alert.error(

      'Operation Failed',

      error?.error?.message ??

      'Something went wrong. Please try again.'

    );

  }


  // =====================================
  // COUNTERS
  // =====================================

  get upcomingCount(): number {

    return this.competitions.filter(

      competition =>
        competition.status === 'UPCOMING'

    ).length;

  }


  get ongoingCount(): number {

    return this.competitions.filter(

      competition =>
        competition.status === 'ONGOING'

    ).length;

  }


  get completedCount(): number {

    return this.competitions.filter(

      competition =>
        competition.status === 'COMPLETED'

    ).length;

  }

}