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
  CompetitionService,
  Competition,
  CompetitionStatus
} from '../../services/competition.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({

  selector: 'app-judge-competitions',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './judge-competitions.html',

  styleUrl: './judge-competitions.css'

})
export class JudgeCompetitions implements OnInit {


  // =========================================================
  // DATA
  // =========================================================

  competitions: Competition[] = [];

  filteredCompetitions: Competition[] = [];


  // =========================================================
  // FILTERS
  // =========================================================

  searchTerm = '';

  selectedStatus: 'ALL' | CompetitionStatus = 'ALL';


  // =========================================================
  // STATE
  // =========================================================

  loading = false;

  selectedCompetition: Competition | null = null;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(

    private competitionService: CompetitionService,

    private alertService: AlertService,

    private cdr: ChangeDetectorRef

  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadCompetitions();

  }


  // =========================================================
  // LOAD COMPETITIONS
  // =========================================================

  loadCompetitions(): void {

    this.loading = true;

    this.competitionService
      .getAllCompetitions()
      .subscribe({

        next: competitions => {

          this.competitions = competitions ?? [];

          this.applyFilters();

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load competitions:',
            error
          );

          this.loading = false;

          this.alertService.error(
            'Unable to Load Competitions',
            'Competition information could not be loaded.'
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // FILTER COMPETITIONS
  // =========================================================

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
              ?.toLowerCase()
              .includes(search) ||

            competition.venue
              ?.toLowerCase()
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


  // =========================================================
  // SEARCH CHANGE
  // =========================================================

  onSearchChange(): void {

    this.applyFilters();

  }


  // =========================================================
  // STATUS CHANGE
  // =========================================================

  onStatusChange(): void {

    this.applyFilters();

  }


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  clearFilters(): void {

    this.searchTerm = '';

    this.selectedStatus = 'ALL';

    this.applyFilters();

  }


  // =========================================================
  // STATISTICS
  // =========================================================

  get totalCompetitions(): number {

    return this.competitions.length;

  }


  get upcomingCompetitions(): number {

    return this.competitions.filter(
      competition =>
        competition.status === 'UPCOMING'
    ).length;

  }


  get ongoingCompetitions(): number {

    return this.competitions.filter(
      competition =>
        competition.status === 'ONGOING'
    ).length;

  }


  get completedCompetitions(): number {

    return this.competitions.filter(
      competition =>
        competition.status === 'COMPLETED'
    ).length;

  }


  // =========================================================
  // STATUS LABEL
  // =========================================================

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


  // =========================================================
  // STATUS ICON
  // =========================================================

  getStatusIcon(
    status: CompetitionStatus
  ): string {

    switch (status) {

      case 'UPCOMING':
        return 'fa-calendar-days';

      case 'ONGOING':
        return 'fa-circle-play';

      case 'COMPLETED':
        return 'fa-circle-check';

      default:
        return 'fa-circle-info';

    }

  }


  // =========================================================
  // DATE FORMAT
  // =========================================================

  formatDate(
    date: string
  ): string {

    if (!date) {
      return '—';
    }


    const parsedDate =
      new Date(date);


    if (Number.isNaN(
      parsedDate.getTime()
    )) {

      return date;

    }


    return parsedDate.toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  // =========================================================
  // SELECT COMPETITION
  // =========================================================

  viewCompetition(
    competition: Competition
  ): void {

    this.selectedCompetition =
      competition;

  }


  // =========================================================
  // CLOSE DETAILS
  // =========================================================

  closeDetails(): void {

    this.selectedCompetition = null;

  }


  // =========================================================
  // REFRESH
  // =========================================================

  refresh(): void {

    if (this.loading) {
      return;
    }

    this.loadCompetitions();

  }


}