import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterModule
} from '@angular/router';

import {
  forkJoin,
  of
} from 'rxjs';

import {
  catchError
} from 'rxjs/operators';

import {
  CompetitionService,
  Competition,
  CompetitionStatus
} from '../../services/competition.service';

import {
  ParticipantService,
  Participant
} from '../../services/participant.service';

import {
  JudgeService,
  Judge,
  JudgeType
} from '../../services/judge.service';

import {
  ResultService
} from '../../services/result.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({
  selector: 'app-judge-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './judge-dashboard.html',

  styleUrl: './judge-dashboard.css'
})
export class JudgeDashboard implements OnInit {


  // =========================================================
  // JUDGE
  // =========================================================

  currentJudge: Judge | null = null;

  judgeType: JudgeType | null = null;

  loadingJudge = false;


  // =========================================================
  // COMPETITIONS
  // =========================================================

  competitions: Competition[] = [];

  activeCompetitions: Competition[] = [];

  upcomingCompetitions: Competition[] = [];

  completedCompetitions: Competition[] = [];

  loadingCompetitions = false;


  // =========================================================
  // PARTICIPANTS
  // =========================================================

  participants: Participant[] = [];

  loadingParticipants = false;


  // =========================================================
  // SCORE PROGRESS
  // =========================================================

  scoredParticipants = 0;

  pendingParticipants = 0;

  loadingProgress = false;


  // =========================================================
  // PAGE STATE
  // =========================================================

  loading = true;

  lastUpdated = new Date();


  constructor(
    private competitionService: CompetitionService,

    private participantService: ParticipantService,

    private judgeService: JudgeService,

    private resultService: ResultService,

    private alertService: AlertService,

    private cdr: ChangeDetectorRef
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadDashboard();

  }


  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  loadDashboard(): void {

    this.loading = true;

    this.loadJudge();

    this.loadCompetitions();

    this.loadParticipants();

  }


  // =========================================================
  // LOAD CURRENT JUDGE
  // =========================================================

  private loadJudge(): void {

    this.loadingJudge = true;

    this.judgeService
      .getCurrentJudge()
      .subscribe({

        next: judge => {

          this.currentJudge = judge;

          this.judgeType = judge.judgeType;

          this.loadingJudge = false;

          this.updatePageState();

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load current judge:',
            error
          );

          this.loadingJudge = false;

          this.alertService.error(
            'Unable to Load Judge',
            'Your judge profile could not be loaded.'
          );

          this.updatePageState();

        }

      });

  }


  // =========================================================
  // LOAD COMPETITIONS
  // =========================================================

  private loadCompetitions(): void {

    this.loadingCompetitions = true;

    this.competitionService
      .getAllCompetitions()
      .subscribe({

        next: competitions => {

          this.competitions = competitions ?? [];

          this.activeCompetitions =
            this.competitions.filter(
              competition =>
                competition.status === 'ONGOING'
            );

          this.upcomingCompetitions =
            this.competitions.filter(
              competition =>
                competition.status === 'UPCOMING'
            );

          this.completedCompetitions =
            this.competitions.filter(
              competition =>
                competition.status === 'COMPLETED'
            );

          this.loadingCompetitions = false;

          this.updatePageState();

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load competitions:',
            error
          );

          this.loadingCompetitions = false;

          this.alertService.error(
            'Unable to Load Competitions',
            'Competition information could not be loaded.'
          );

          this.updatePageState();

        }

      });

  }


  // =========================================================
  // LOAD PARTICIPANTS
  // =========================================================

  private loadParticipants(): void {

    this.loadingParticipants = true;

    this.participantService
      .getParticipantsForJudge()
      .subscribe({

        next: participants => {

          this.participants =
            participants ?? [];

          this.loadingParticipants = false;

          this.calculateScoreProgress();

          this.updatePageState();

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load judge participants:',
            error
          );

          this.loadingParticipants = false;

          this.alertService.error(
            'Unable to Load Participants',
            'Approved participants assigned for judging could not be loaded.'
          );

          this.updatePageState();

        }

      });

  }


  // =========================================================
  // CALCULATE SCORE PROGRESS
  // =========================================================

  private calculateScoreProgress(): void {

    this.loadingProgress = true;

    this.scoredParticipants = 0;

    this.pendingParticipants = 0;


    if (this.participants.length === 0) {

      this.loadingProgress = false;

      this.updatePageState();

      return;

    }


    /*
     * The normal Judge participant-score endpoint
     * returns the current Judge's score for the
     * selected participant.
     *
     * Therefore we can determine whether each
     * participant has already been scored.
     */

    const requests =
      this.participants.map(
        participant =>
          this.resultService
            .getParticipantScores(participant.id)
            .pipe(
              catchError(error => {

                console.error(
                  `Failed to check score for participant ${participant.id}:`,
                  error
                );

                return of([]);

              })
            )
      );


    forkJoin(requests)
      .subscribe({

        next: results => {

          results.forEach(scores => {

            if (scores.length > 0) {

              this.scoredParticipants++;

            }

          });


          this.pendingParticipants =
            Math.max(
              this.participants.length -
              this.scoredParticipants,
              0
            );


          this.loadingProgress = false;

          this.updatePageState();

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to calculate scoring progress:',
            error
          );

          this.loadingProgress = false;

          this.scoredParticipants = 0;

          this.pendingParticipants =
            this.participants.length;

          this.updatePageState();

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // PAGE LOADING STATE
  // =========================================================

  private updatePageState(): void {

    this.loading =
      this.loadingJudge ||
      this.loadingCompetitions ||
      this.loadingParticipants;

  }


  // =========================================================
  // JUDGE TYPE LABEL
  // =========================================================

  get judgeTypeLabel(): string {

    switch (this.judgeType) {

      case 'MEMORIZATION':
        return 'Memorization Judge';

      case 'TAJWEED':
        return 'Tajweed Judge';

      case 'MAKHARIJ':
        return 'Makharij Judge';

      case 'CHIEF':
        return 'Chief Judge';

      default:
        return 'Judge';

    }

  }


  // =========================================================
  // SCORE CATEGORY
  // =========================================================

  get scoreCategory(): string {

    switch (this.judgeType) {

      case 'MEMORIZATION':
        return 'Memorization';

      case 'TAJWEED':
        return 'Tajweed';

      case 'MAKHARIJ':
        return 'Makharij';

      default:
        return 'Scoring';

    }

  }


  // =========================================================
  // MAX SCORE
  // =========================================================

  get maxScore(): number {

    switch (this.judgeType) {

      case 'MEMORIZATION':
        return 50;

      case 'TAJWEED':
        return 30;

      case 'MAKHARIJ':
        return 20;

      default:
        return 0;

    }

  }


  // =========================================================
  // PROGRESS PERCENTAGE
  // =========================================================

  get scoringProgress(): number {

    if (this.participants.length === 0) {
      return 0;
    }


    return Math.round(
      (
        this.scoredParticipants /
        this.participants.length
      ) * 100
    );

  }


  // =========================================================
  // JUDGE HAS ACTIVE WORK
  // =========================================================

  get hasActiveWork(): boolean {

    return this.participants.length > 0;

  }


  // =========================================================
  // CURRENT COMPETITION
  // =========================================================

  get currentCompetition(): Competition | null {

    if (this.activeCompetitions.length === 0) {
      return null;
    }

    return this.activeCompetitions[0];

  }


  // =========================================================
  // JUZUU COUNT
  // =========================================================

  get juzuuCount(): number {

    return new Set(
      this.participants.map(
        participant =>
          participant.juzuu
      )
    ).size;

  }


  // =========================================================
  // MADRASA COUNT
  // =========================================================

  get madrasaCount(): number {

    return new Set(
      this.participants.map(
        participant =>
          participant.madrasa
      )
    ).size;

  }


  // =========================================================
  // STATUS LABEL
  // =========================================================

  getStatusLabel(
    status: CompetitionStatus
  ): string {

    switch (status) {

      case 'ONGOING':
        return 'Ongoing';

      case 'UPCOMING':
        return 'Upcoming';

      case 'COMPLETED':
        return 'Completed';

      default:
        return status;

    }

  }


  // =========================================================
  // DATE FORMAT
  // =========================================================

  formatDate(
    date: string
  ): string {

    if (!date) {
      return '-';
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
  // REFRESH
  // =========================================================

  refreshDashboard(): void {

    this.lastUpdated = new Date();

    this.loadDashboard();

  }

}