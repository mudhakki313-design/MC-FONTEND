import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule
} from '@angular/forms';

import {
  CompetitionService,
  Competition
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
  selector: 'app-chief-scores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chief-scores.html',
  styleUrl: './chief-scores.css',
})
export class ChiefScores implements OnInit {


  // =========================================================
  // DATA
  // =========================================================

  competitions: Competition[] = [];

  results: Result[] = [];


  // =========================================================
  // FILTERS
  // =========================================================

  selectedCompetitionId: number | null = null;

  selectedJuzuu: Juzuu | '' = '';


  // =========================================================
  // STATES
  // =========================================================

  loadingCompetitions = false;

  loadingResults = false;

  generating = false;


  // =========================================================
  // JUZUU LIST
  // =========================================================

  readonly juzuuList: Juzuu[] = [

    'JUZUU_1',
    'JUZUU_2',
    'JUZUU_3',
    'JUZUU_4',
    'JUZUU_5',
    'JUZUU_6',
    'JUZUU_7',
    'JUZUU_8',
    'JUZUU_9',
    'JUZUU_10',
    'JUZUU_11',
    'JUZUU_12',
    'JUZUU_13',
    'JUZUU_14',
    'JUZUU_15',
    'JUZUU_16',
    'JUZUU_17',
    'JUZUU_18',
    'JUZUU_19',
    'JUZUU_20',
    'JUZUU_21',
    'JUZUU_22',
    'JUZUU_23',
    'JUZUU_24',
    'JUZUU_25',
    'JUZUU_26',
    'JUZUU_27',
    'JUZUU_28',
    'JUZUU_29',
    'JUZUU_30'

  ];


  constructor(
    private competitionService: CompetitionService,
    private resultService: ResultService,
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

    this.loadingCompetitions = true;

    this.competitionService
      .getAllCompetitions()
      .subscribe({

        next: competitions => {

          this.competitions = competitions;

          this.cdr.detectChanges();

          this.loadingCompetitions = false;

        },

        error: error => {

          console.error(
            'Failed to load competitions:',
            error
          );

          this.loadingCompetitions = false;

          this.alertService.error(
            'Failed to Load Competitions',
            'Unable to load competition information.'
          );

        }

      });

  }


  // =========================================================
  // LOAD SAVED RESULTS
  // =========================================================

  loadResults(): void {

    if (
      !this.selectedCompetitionId ||
      !this.selectedJuzuu
    ) {

      this.alertService.warning(
        'Select Competition and Juzuu',
        'Please select both competition and Juzuu first.'
      );

      return;

    }


    this.loadingResults = true;

    this.resultService
      .getCompetitionResults(
        this.selectedCompetitionId,
        this.selectedJuzuu
      )
      .subscribe({

        next: results => {

          this.results = results;

          this.cdr.detectChanges();

          this.loadingResults = false;

        },

        error: error => {

          console.error(
            'Failed to load results:',
            error
          );

          this.results = [];

          this.loadingResults = false;

          this.alertService.error(
            'Failed to Load Results',
            'Unable to load saved competition results.'
          );

        }

      });

  }


  // =========================================================
  // GENERATE RESULTS
  // =========================================================

  async generateResults(): Promise<void> {

    if (
      !this.selectedCompetitionId ||
      !this.selectedJuzuu
    ) {

      this.alertService.warning(
        'Select Competition and Juzuu',
        'Please select both competition and Juzuu first.'
      );

      return;

    }


    const confirmed =
      await this.alertService.confirm(
        'Generate Results?',
        'The system will calculate scores, rank participants and save the results.',
        'Generate'
      );


    if (!confirmed) {

      return;

    }


    this.generating = true;

    this.alertService.loading(
      'Generating competition results...'
    );


    this.resultService
      .generateCompetitionResults(
        this.selectedCompetitionId,
        this.selectedJuzuu
      )
      .subscribe({

        next: results => {

          this.alertService.close();

          this.results = results;

          this.generating = false;

          this.alertService.success(
            'Results Generated',
            'Competition results have been calculated and saved successfully.'
          );

        },

        error: error => {

          console.error(
            'Failed to generate results:',
            error
          );

          this.alertService.close();

          this.generating = false;


          const message =
            error?.error?.message ??
            'Unable to generate results. Make sure all participants have completed the three required judging scores.';


          this.alertService.error(
            'Unable to Generate Results',
            message
          );

        }

      });

  }


  // =========================================================
  // FORMAT JUZUU
  // =========================================================

  formatJuzuu(
    juzuu: string
  ): string {

    return juzuu
      .replace('JUZUU_', 'Juzuu ');

  }


  // =========================================================
  // GET RANK CLASS
  // =========================================================

  getRankClass(
    rank: number
  ): string {

    if (rank === 1) {
      return 'gold';
    }

    if (rank === 2) {
      return 'silver';
    }

    if (rank === 3) {
      return 'bronze';
    }

    return '';

  }


  // =========================================================
  // TOTAL
  // =========================================================

  get totalParticipants(): number {

    return this.results.length;

  }


  // =========================================================
  // TOP SCORE
  // =========================================================

  get topScore(): number {

    if (!this.results.length) {
      return 0;
    }

    return Math.max(
      ...this.results.map(
        result => result.totalScore
      )
    );

  }

}