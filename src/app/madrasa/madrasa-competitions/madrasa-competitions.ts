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
  CompetitionService,
  CompetitionStatus
} from '../../services/competition.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({

  selector: 'app-madrasa-competitions',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './madrasa-competitions.html',

  styleUrl: './madrasa-competitions.css'

})
export class MadrasaCompetitions
  implements OnInit {


  // =====================================================
  // DATA
  // =====================================================

  competitions: Competition[] = [];

  filteredCompetitions: Competition[] = [];


  // =====================================================
  // STATE
  // =====================================================

  loading = false;

  selectedCompetition:
    Competition | null = null;

  showDetailsModal = false;


  // =====================================================
  // SEARCH & FILTER
  // =====================================================

  searchTerm = '';

  selectedStatus:
    CompetitionStatus | 'ALL' = 'ALL';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private competitionService:
      CompetitionService,

    private alertService:
      AlertService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadCompetitions();

  }


  // =====================================================
  // LOAD COMPETITIONS
  // =====================================================

  loadCompetitions(): void {

    this.loading = true;

    this.competitionService
      .getAllCompetitions()
      .subscribe({

        next: competitions => {

          this.competitions =
            competitions ?? [];

          this.applyFilter();

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load competitions:',
            error
          );

          this.loading = false;

          if (error?.status === 403) {

            this.alertService.error(
              'Access Denied',
              'Your madrasa account is not allowed to view competitions.'
            );

          } else {

            this.alertService.error(
              'Unable to Load Competitions',
              this.getBackendError(
                error,
                'Competition information could not be loaded.'
              )
            );

          }

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // SEARCH
  // =====================================================

  applyFilter(): void {

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
              ?.toLowerCase()
              .includes(search)

            ||

            competition.venue
              ?.toLowerCase()
              .includes(search);


          const matchesStatus =

            this.selectedStatus === 'ALL'

            ||

            competition.status ===
              this.selectedStatus;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

  }


  // =====================================================
  // SEARCH CHANGE
  // =====================================================

  onSearchChange(): void {

    this.applyFilter();

  }


  // =====================================================
  // STATUS CHANGE
  // =====================================================

  onStatusChange(): void {

    this.applyFilter();

  }


  // =====================================================
  // VIEW DETAILS
  // =====================================================

  viewDetails(
    competition: Competition
  ): void {

    this.selectedCompetition =
      competition;

    this.showDetailsModal = true;

  }


  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  closeDetails(): void {

    this.showDetailsModal = false;

    this.selectedCompetition =
      null;

  }


  // =====================================================
  // STATUS LABEL
  // =====================================================

  getStatusLabel(
    status: CompetitionStatus
  ): string {

    switch (status) {

      case 'UPCOMING':
        return 'Upcoming';

      case 'ONGOING':
        return 'Ongoing';

      case 'COMPLETED':
        return 'Completed';

      default:
        return status;

    }

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(
    status: CompetitionStatus
  ): string {

    switch (status) {

      case 'UPCOMING':
        return 'status-upcoming';

      case 'ONGOING':
        return 'status-ongoing';

      case 'COMPLETED':
        return 'status-completed';

      default:
        return '';

    }

  }


  // =====================================================
  // DATE FORMAT
  // =====================================================

  formatDate(
    date: string
  ): string {

    if (!date) {

      return '—';

    }


    const parsedDate =
      new Date(date);


    if (isNaN(parsedDate.getTime())) {

      return date;

    }


    return parsedDate.toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    );

  }


  // =====================================================
  // DATE + TIME
  // =====================================================

  formatDateTime(
    date: string
  ): string {

    if (!date) {

      return '—';

    }


    const parsedDate =
      new Date(date);


    if (isNaN(parsedDate.getTime())) {

      return date;

    }


    return parsedDate.toLocaleString(
      'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }
    );

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refresh(): void {

    if (this.loading) {

      return;

    }

    this.loadCompetitions();

  }


  // =====================================================
  // BACKEND ERROR
  // =====================================================

  private getBackendError(
    error: any,
    fallback: string
  ): string {

    if (
      error?.error?.message
    ) {

      return error.error.message;

    }


    if (
      error?.error?.detail
    ) {

      return error.error.detail;

    }


    if (
      error?.error?.errors
    ) {

      return error.error.errors;

    }


    if (
      typeof error?.error === 'string'
    ) {

      return error.error;

    }


    return fallback;

  }

}