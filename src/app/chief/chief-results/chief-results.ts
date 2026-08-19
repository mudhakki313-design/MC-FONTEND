import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ResultService,
  Result,
  Juzuu
} from '../../services/result.service';

import {
  CompetitionService,
  Competition
} from '../../services/competition.service';

import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-chief-results',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './chief-results.html',
  styleUrl: './chief-results.css',
})
export class ChiefResults implements OnInit {


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

  loading = false;

  generating = false;

  editing = false;


  // =========================================================
  // EDIT
  // =========================================================

  editingResult: Result | null = null;

  editTotalScore = 0;

  editRank = 0;


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


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(

    private resultService: ResultService,

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

    this.competitionService
      .getAllCompetitions()
      .subscribe({

        next: competitions => {

          this.competitions = competitions;
          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load competitions:',
            error
          );

          this.alertService.error(
            'Failed to Load Competitions',
            'Unable to retrieve competitions.'
          );

        }

      });

  }


  // =========================================================
  // LOAD RESULTS
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


    this.loading = true;


    this.resultService
      .getCompetitionResults(
        this.selectedCompetitionId,
        this.selectedJuzuu
      )
      .subscribe({

        next: results => {

          this.results = results;

          this.cdr.detectChanges();

          this.loading = false;

        },

        error: error => {

          console.error(
            'Failed to load results:',
            error
          );

          this.results = [];

          this.loading = false;

          if (error.status === 404) {

            this.alertService.info(
              'No Results Found',
              'No generated results were found for this competition and Juzuu.'
            );

          } else {

            this.alertService.error(
              'Failed to Load Results',
              'Unable to retrieve competition results.'
            );

          }

        }

      });

  }


  // =========================================================
  // GENERATE RESULTS
  // =========================================================

  generateResults(): void {

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


    this.alertService
      .confirm(

        'Generate Results?',

        'This will calculate and save the ranking for all approved participants using their three judging scores.',

        'Generate'

      )
      .then(confirmed => {

        if (!confirmed) {
          return;
        }


        this.generating = true;


        this.alertService.loading(
          'Generating competition results...'
        );


        this.resultService
          .generateCompetitionResults(
            this.selectedCompetitionId!,
            this.selectedJuzuu as Juzuu
          )
          .subscribe({

            next: results => {

              this.alertService.close();

              this.results = results;

              this.generating = false;


              this.alertService.success(
                'Results Generated',
                'Competition results have been generated successfully.'
              );

            },

            error: error => {

              this.alertService.close();

              this.generating = false;

              console.error(
                'Failed to generate results:',
                error
              );


              const message =
                error?.error?.message ||
                'Unable to generate competition results.';


              this.alertService.error(
                'Generation Failed',
                message
              );

            }

          });

      });

  }


  // =========================================================
  // EDIT RESULT
  // =========================================================

  openEdit(result: Result): void {

    this.editingResult = result;

    this.editTotalScore = result.totalScore;

    this.editRank = result.rank;

    this.editing = true;

  }


  // =========================================================
  // CLOSE EDIT
  // =========================================================

  closeEdit(): void {

    this.editing = false;

    this.editingResult = null;

  }


  // =========================================================
  // SAVE EDIT
  // =========================================================

  saveEdit(): void {

    if (!this.editingResult) {
      return;
    }


    if (
      this.editTotalScore < 0 ||
      this.editRank < 1
    ) {

      this.alertService.warning(
        'Invalid Values',
        'Total score cannot be negative and rank must be at least 1.'
      );

      return;

    }


    this.alertService
      .confirm(

        'Save Changes?',

        `Update result for ${this.editingResult.participant}?`,

        'Save Changes'

      )
      .then(confirmed => {

        if (!confirmed) {
          return;
        }


        this.alertService.loading(
          'Saving changes...'
        );


        this.resultService
          .updateResult(
            this.editingResult!.resultId,
            {
              totalScore: this.editTotalScore,
              rank: this.editRank
            }
          )
          .subscribe({

            next: updatedResult => {

              this.alertService.close();


              const index =
                this.results.findIndex(
                  result =>
                    result.resultId ===
                    updatedResult.resultId
                );


              if (index !== -1) {

                this.results[index] =
                  updatedResult;

              }


              this.results =
                [...this.results]
                  .sort(
                    (a, b) =>
                      a.rank - b.rank
                  );


              this.closeEdit();


              this.alertService.success(
                'Result Updated',
                'The competition result has been updated successfully.'
              );

            },

            error: error => {

              this.alertService.close();

              console.error(
                'Failed to update result:',
                error
              );


              const message =
                error?.error?.message ||
                'Unable to update the result.';


              this.alertService.error(
                'Update Failed',
                message
              );

            }

          });

      });

  }


  // =========================================================
  // FORMAT JUZUU
  // =========================================================

  formatJuzuu(juzuu: string): string {

    return juzuu
      .replace('JUZUU_', 'Juzuu ');

  }


  // =========================================================
  // GET POSITION CLASS
  // =========================================================

  getRankClass(rank: number): string {

    if (rank === 1) {
      return 'rank-first';
    }

    if (rank === 2) {
      return 'rank-second';
    }

    if (rank === 3) {
      return 'rank-third';
    }

    return '';

  }

}