import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  forkJoin
} from 'rxjs';

import {
  Competition,
  CompetitionService
} from '../../services/competition.service';

import {
  Participant,
  ParticipantService
} from '../../services/participant.service';

import {
  Madrasa,
  MadrasaService
} from '../../services/madrasa.service';

import {
  Judge,
  JudgeService
} from '../../services/judge.service';

import {
  ResultService,
  Score
} from '../../services/result.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({

  selector: 'app-chief-daashboard',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './chief-daashboard.html',

  styleUrl: './chief-daashboard.css'

})
export class ChiefDaashboard implements OnInit {


  // =========================================================
  // DATA
  // =========================================================

  competitions: Competition[] = [];

  participants: Participant[] = [];

  madrasas: Madrasa[] = [];

  judges: Judge[] = [];

  scores: Score[] = [];


  // =========================================================
  // STATE
  // =========================================================

  loading = false;

  lastUpdated: Date | null = null;


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadDashboard();

  }


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(

    private competitionService:
      CompetitionService,

    private participantService:
      ParticipantService,

    private madrasaService:
      MadrasaService,

    private judgeService:
      JudgeService,

    private resultService:
      ResultService,

    private alert:
      AlertService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  loadDashboard(): void {

    this.loading = true;


    forkJoin({

      competitions:
        this.competitionService
          .getAllCompetitions(),

      participants:
        this.participantService
          .getAllParticipants(),

      madrasas:
        this.madrasaService
          .getAllMadrasas(),

      judges:
        this.judgeService
          .getAllJudges(),

      scores:
        this.resultService
          .getAllScores()

    }).subscribe({

      next: data => {

        this.competitions =
          data.competitions ?? [];

        this.participants =
          data.participants ?? [];

        this.madrasas =
          data.madrasas ?? [];

        this.judges =
          data.judges ?? [];

        this.scores =
          data.scores ?? [];


        this.lastUpdated =
          new Date();

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: error => {

        console.error(
          'Failed to load Chief Judge dashboard:',
          error
        );

        this.loading = false;

        this.alert.error(
          'Dashboard Load Failed',
          'Unable to load dashboard information. Please try again.'
        );

        this.cdr.detectChanges();

      }

    });

  }


  // =========================================================
  // REFRESH
  // =========================================================

  refreshDashboard(): void {

    this.loadDashboard();

  }


  // =========================================================
  // COMPETITION COUNTS
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
  // PARTICIPANT COUNTS
  // =========================================================

  get totalParticipants(): number {

    return this.participants.length;

  }


  get approvedParticipants(): number {

    return this.participants.filter(
      participant =>
        participant.status === 'APPROVED'
    ).length;

  }


  get pendingParticipants(): number {

    return this.participants.filter(
      participant =>
        participant.status === 'PENDING'
    ).length;

  }


  get rejectedParticipants(): number {

    return this.participants.filter(
      participant =>
        participant.status === 'REJECTED'
    ).length;

  }


  // =========================================================
  // JUDGE COUNTS
  // =========================================================

  get totalJudges(): number {

    return this.judges.length;

  }


  get activeJudges(): number {

    return this.judges.filter(
      judge =>
        judge.status === 'ACTIVE'
    ).length;

  }


  get inactiveJudges(): number {

    return this.judges.filter(
      judge =>
        judge.status === 'INACTIVE'
    ).length;

  }


  // =========================================================
  // MADRASA
  // =========================================================

  get totalMadrasas(): number {

    return this.madrasas.length;

  }


  // =========================================================
  // SCORE STATISTICS
  // =========================================================

  get totalScores(): number {

    return this.scores.length;

  }


  /**
   * Number of unique participants
   * who already have at least one score.
   */
  get participantsWithScores(): number {

    return new Set(
      this.scores.map(
        score => score.participantId
      )
    ).size;

  }


  /**
   * Approximate judging completion.
   *
   * Each participant is expected to have
   * three judging scores:
   *
   * Memorization = 50
   * Tajweed      = 30
   * Makharij     = 20
   *
   * Total = 100
   */
  get judgingCompletion(): number {

    const approved =
      this.approvedParticipants;

    if (approved === 0) {

      return 0;

    }


    const expectedScores =
      approved * 3;


    if (expectedScores === 0) {

      return 0;

    }


    const percentage =
      (this.totalScores /
        expectedScores) * 100;


    return Math.min(
      100,
      Math.round(percentage)
    );

  }


  // =========================================================
  // SCORE BREAKDOWN
  // =========================================================

  get memorizationScores(): number {

    return this.scores.filter(
      score =>
        score.judgeType === 'MEMORIZATION'
    ).length;

  }


  get tajweedScores(): number {

    return this.scores.filter(
      score =>
        score.judgeType === 'TAJWEED'
    ).length;

  }


  get makharijScores(): number {

    return this.scores.filter(
      score =>
        score.judgeType === 'MAKHARIJ'
    ).length;

  }


  // =========================================================
  // SCORE PROGRESS
  // =========================================================

  get memorizationProgress(): number {

    return this.calculateCategoryProgress(
      this.memorizationScores
    );

  }


  get tajweedProgress(): number {

    return this.calculateCategoryProgress(
      this.tajweedScores
    );

  }


  get makharijProgress(): number {

    return this.calculateCategoryProgress(
      this.makharijScores
    );

  }


  private calculateCategoryProgress(
    submitted: number
  ): number {

    if (this.approvedParticipants === 0) {

      return 0;

    }


    const percentage =
      (submitted /
        this.approvedParticipants) * 100;


    return Math.min(
      100,
      Math.round(percentage)
    );

  }


  // =========================================================
  // CURRENT COMPETITION
  // =========================================================

  get currentCompetition(): Competition | null {

    const ongoing =
      this.competitions.find(
        competition =>
          competition.status === 'ONGOING'
      );

    if (ongoing) {

      return ongoing;

    }


    return null;

  }


  // =========================================================
  // NEXT COMPETITION
  // =========================================================

  get nextCompetition(): Competition | null {

    const upcoming =
      this.competitions
        .filter(
          competition =>
            competition.status === 'UPCOMING'
        )
        .sort(
          (a, b) =>
            new Date(a.competitionDate).getTime()
            -
            new Date(b.competitionDate).getTime()
        );


    return upcoming.length > 0
      ? upcoming[0]
      : null;

  }


  // =========================================================
  // RECENT SCORES
  // =========================================================

  get recentScores(): Score[] {

    return [
      ...this.scores
    ]

      .sort(
        (a, b) =>
          b.id - a.id
      )

      .slice(0, 6);

  }


  // =========================================================
  // TOP COMPETITIONS
  // =========================================================

  get competitionPerformance():

    {
      competition: Competition;
      participants: number;
      scores: number;
      progress: number;
    }[] {

    return this.competitions

      .map(competition => {

        const participants =
          this.participants.filter(
            participant =>
              participant.competition ===
              competition.title
          ).length;


        const scores =
          this.scores.filter(
            score =>
              score.competitionId ===
              competition.id
          ).length;


        const expected =
          participants * 3;


        const progress =
          expected > 0
            ? Math.min(
                100,
                Math.round(
                  (scores / expected) * 100
                )
              )
            : 0;


        return {

          competition,

          participants,

          scores,

          progress

        };

      })

      .sort(
        (a, b) =>
          b.participants -
          a.participants
      )

      .slice(0, 5);

  }


  // =========================================================
  // PARTICIPANT STATUS
  // =========================================================

  get participantApprovalRate(): number {

    if (this.totalParticipants === 0) {

      return 0;

    }


    return Math.round(
      (
        this.approvedParticipants /
        this.totalParticipants
      ) * 100
    );

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


    return new Date(date)
      .toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      );

  }


  // =========================================================
  // TIME
  // =========================================================

  formatTime(
    date: string
  ): string {

    if (!date) {

      return '';

    }


    return new Date(date)
      .toLocaleTimeString(
        'en-GB',
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      );

  }


  // =========================================================
  // JUZUU LABEL
  // =========================================================

  formatJuzuu(
    juzuu: string
  ): string {

    if (!juzuu) {

      return '—';

    }


    return juzuu
      .replace(
        'JUZUU_',
        'Juzuu '
      );

  }


  // =========================================================
  // COMPETITION STATUS CLASS
  // =========================================================

  getStatusClass(
    status: string
  ): string {

    return status
      .toLowerCase();

  }


  // =========================================================
  // SCORE TYPE LABEL
  // =========================================================

  getJudgeTypeLabel(
    type: string
  ): string {

    switch (type) {

      case 'MEMORIZATION':
        return 'Memorization';

      case 'TAJWEED':
        return 'Tajweed';

      case 'MAKHARIJ':
        return 'Makharij';

      case 'CHIEF':
        return 'Chief Judge';

      default:
        return type;

    }

  }

}