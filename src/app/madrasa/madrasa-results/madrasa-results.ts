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
  CompetitionService
} from '../../services/competition.service';

import {
  ResultService,
  Result,
  Juzuu
} from '../../services/result.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({

  selector: 'app-madrasa-results',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './madrasa-results.html',

  styleUrl: './madrasa-results.css'

})
export class MadrasaResults
  implements OnInit {


  // =====================================================
  // DATA
  // =====================================================

  competitions: Competition[] = [];

  results: Result[] = [];

  filteredResults: Result[] = [];


  // =====================================================
  // STATE
  // =====================================================

  competitionLoading = false;

  resultsLoading = false;

  hasSearched = false;


  // =====================================================
  // FILTER
  // =====================================================

  selectedCompetitionId: number | null = null;

  selectedJuzuu: Juzuu = 'JUZUU_1';

  searchTerm = '';


  // =====================================================
  // JUZUU LIST
  // =====================================================

  juzuuList: Juzuu[] = Array.from(
    { length: 30 },
    (_, index) =>
      `JUZUU_${index + 1}` as Juzuu
  );


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private competitionService:
      CompetitionService,

    private resultService:
      ResultService,

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

    if (this.competitionLoading) {

      return;

    }

    this.competitionLoading = true;


    this.competitionService
      .getAllCompetitions()
      .subscribe({

        next: competitions => {

          this.competitions =
            competitions ?? [];

          this.competitionLoading =
            false;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load competitions:',
            error
          );

          this.competitionLoading =
            false;

          this.alertService.error(
            'Unable to Load Competitions',
            this.getBackendError(
              error,
              'Competition information could not be loaded.'
            )
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD RESULTS
  // =====================================================

  loadResults(): void {

    if (this.resultsLoading) {

      return;

    }


    // ---------------------------------------------------
    // VALIDATE COMPETITION
    // ---------------------------------------------------

    if (
      this.selectedCompetitionId === null
    ) {

      this.alertService.warning(
        'Competition Required',
        'Please select a competition first.'
      );

      return;

    }


    // ---------------------------------------------------
    // VALIDATE JUZUU
    // ---------------------------------------------------

    if (!this.selectedJuzuu) {

      this.alertService.warning(
        'Juzuu Required',
        'Please select a Juzuu first.'
      );

      return;

    }


    // ---------------------------------------------------
    // START LOADING
    // ---------------------------------------------------

    this.resultsLoading = true;

    this.hasSearched = true;

    this.results = [];

    this.filteredResults = [];


    // ---------------------------------------------------
    // REQUEST
    // ---------------------------------------------------

    this.resultService
      .getCompetitionResults(
        this.selectedCompetitionId,
        this.selectedJuzuu
      )
      .subscribe({

        next: results => {

          this.results =
            results ?? [];

          this.applyFilter();

          this.resultsLoading =
            false;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load competition results:',
            error
          );

          this.resultsLoading =
            false;

          this.results = [];

          this.filteredResults = [];


          this.alertService.error(
            'Unable to Load Results',
            this.getBackendError(
              error,
              'Results could not be loaded for the selected competition and Juzuu.'
            )
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  applyFilter(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    // ---------------------------------------------------
    // NO SEARCH
    // ---------------------------------------------------

    if (!search) {

      this.filteredResults =
        [...this.results];

      return;

    }


    // ---------------------------------------------------
    // FILTER RESULTS
    // ---------------------------------------------------

    this.filteredResults =
      this.results.filter(
        result => {

          const participant =
            result.participant
              ?.toLowerCase() ?? '';

          const madrasa =
            result.madrasa
              ?.toLowerCase() ?? '';

          const competition =
            result.competition
              ?.toLowerCase() ?? '';

          const rank =
            String(
              result.rank ?? ''
            );

          const score =
            String(
              result.totalScore ?? ''
            );


          return (

            participant.includes(search)

            ||

            madrasa.includes(search)

            ||

            competition.includes(search)

            ||

            rank.includes(search)

            ||

            score.includes(search)

          );

        }

      );

  }


  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  clearSearch(): void {

    this.searchTerm = '';

    this.applyFilter();

  }


  // =====================================================
  // COMPETITION CHANGE
  // =====================================================

  onCompetitionChange(): void {

    this.results = [];

    this.filteredResults = [];

    this.hasSearched = false;

    this.searchTerm = '';

  }


  // =====================================================
  // JUZUU CHANGE
  // =====================================================

  onJuzuuChange(): void {

    this.results = [];

    this.filteredResults = [];

    this.hasSearched = false;

    this.searchTerm = '';

  }


  // =====================================================
  // SELECTED COMPETITION
  // =====================================================

  get selectedCompetition():
    Competition | null {

    if (
      this.selectedCompetitionId === null
    ) {

      return null;

    }


    return (
      this.competitions.find(
        competition =>
          competition.id ===
          this.selectedCompetitionId
      ) ?? null
    );

  }


  // =====================================================
  // SELECTED COMPETITION TITLE
  // =====================================================

  getSelectedCompetitionTitle(): string {

    return (
      this.selectedCompetition?.title
      ?? 'Competition Results'
    );

  }


  // =====================================================
  // PARTICIPANT INITIAL
  // =====================================================

  getParticipantInitial(
    participant: string | null | undefined
  ): string {

    if (
      !participant ||
      !participant.trim()
    ) {

      return '?';

    }


    return participant
      .trim()
      .charAt(0)
      .toUpperCase();

  }


  // =====================================================
  // JUZUU LABEL
  // =====================================================

  getJuzuuLabel(
    juzuu: string | null | undefined
  ): string {

    if (!juzuu) {

      return '—';

    }


    return juzuu.replace(
      'JUZUU_',
      'Juzuu '
    );

  }


  // =====================================================
  // TOTAL PARTICIPANTS
  // =====================================================

  get totalParticipants(): number {

    return this.results.length;

  }


  // =====================================================
  // TOP SCORE
  // =====================================================

  get topScore(): number {

    if (
      this.results.length === 0
    ) {

      return 0;

    }


    return Math.max(
      ...this.results.map(
        result =>
          Number(
            result.totalScore
          ) || 0
      )
    );

  }


  // =====================================================
  // FIRST POSITION
  // =====================================================

  get firstPosition(): Result | null {

    if (
      this.results.length === 0
    ) {

      return null;

    }


    return (
      this.results.find(
        result =>
          result.rank === 1
      ) ?? null
    );

  }


  // =====================================================
  // HAS RESULTS
  // =====================================================

  get hasResults(): boolean {

    return this.results.length > 0;

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refresh(): void {

    this.loadCompetitions();


    if (
      this.selectedCompetitionId !== null &&
      this.hasSearched
    ) {

      this.loadResults();

    }

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

      if (
        typeof error.error.errors === 'string'
      ) {

        return error.error.errors;

      }


      try {

        return JSON.stringify(
          error.error.errors
        );

      } catch {

        return fallback;

      }

    }


    if (
      typeof error?.error === 'string'
    ) {

      return error.error;

    }


    if (
      typeof error?.message === 'string'
    ) {

      return error.message;

    }


    return fallback;

  }

}