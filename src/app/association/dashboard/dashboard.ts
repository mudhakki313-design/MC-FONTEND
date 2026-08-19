import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ParticipantService,
  Participant
} from '../../services/participant.service';

import {
  MadrasaService,
  Madrasa
} from '../../services/madrasa.service';

import {
  JudgeService,
  Judge
} from '../../services/judge.service';

import {
  CompetitionService,
  Competition
} from '../../services/competition.service';

import {
  ResultService,
  Score
} from '../../services/result.service';


@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {


  // =========================================================
  // DATA
  // =========================================================

  participants: Participant[] = [];

  madrasas: Madrasa[] = [];

  judges: Judge[] = [];

  competitions: Competition[] = [];

  scores: Score[] = [];


  // =========================================================
  // LOADING
  // =========================================================

  loading = true;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private participantService: ParticipantService,
    private madrasaService: MadrasaService,
    private judgeService: JudgeService,
    private competitionService: CompetitionService,
    private resultService: ResultService,
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


    let completed = 0;

    let loaded = 0;

    const checkComplete = () => {

      loaded++;

      if (loaded === 5) {

        this.loading = false;

        this.cdr.detectChanges();

      }

    };


    // -------------------------------------------------------
    // PARTICIPANTS
    // -------------------------------------------------------

    this.participantService
      .getAllParticipants()
      .subscribe({

        next: data => {

          this.participants = data ?? [];

          checkComplete();

        },

        error: error => {

          console.error(
            'Failed to load participants:',
            error
          );

          this.participants = [];

          checkComplete();

        }

      });


    // -------------------------------------------------------
    // MADRASAS
    // -------------------------------------------------------

    this.madrasaService
      .getAllMadrasas()
      .subscribe({

        next: data => {

          this.madrasas = data ?? [];

          checkComplete();

        },

        error: error => {

          console.error(
            'Failed to load madrasas:',
            error
          );

          this.madrasas = [];

          checkComplete();

        }

      });


    // -------------------------------------------------------
    // JUDGES
    // -------------------------------------------------------

    this.judgeService
      .getAllJudges()
      .subscribe({

        next: data => {

          this.judges = data ?? [];

          checkComplete();

        },

        error: error => {

          console.error(
            'Failed to load judges:',
            error
          );

          this.judges = [];

          checkComplete();

        }

      });


    // -------------------------------------------------------
    // COMPETITIONS
    // -------------------------------------------------------

    this.competitionService
      .getAllCompetitions()
      .subscribe({

        next: data => {

          this.competitions = data ?? [];

          checkComplete();

        },

        error: error => {

          console.error(
            'Failed to load competitions:',
            error
          );

          this.competitions = [];

          checkComplete();

        }

      });


    // -------------------------------------------------------
    // SCORES
    // -------------------------------------------------------

    this.resultService
      .getAllScores()
      .subscribe({

        next: data => {

          this.scores = data ?? [];

          checkComplete();

        },

        error: error => {

          console.error(
            'Failed to load scores:',
            error
          );

          this.scores = [];

          checkComplete();

        }

      });

  }


  // =========================================================
  // SUMMARY
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


  get totalMadrasas(): number {

    return this.madrasas.length;

  }


  get totalJudges(): number {

    return this.judges.length;

  }


  get activeJudges(): number {

    return this.judges.filter(
      judge =>
        judge.status === 'ACTIVE'
    ).length;

  }


  get totalCompetitions(): number {

    return this.competitions.length;

  }


  get ongoingCompetitions(): number {

    return this.competitions.filter(
      competition =>
        competition.status === 'ONGOING'
    ).length;

  }


  get totalScores(): number {

    return this.scores.length;

  }


  // =========================================================
  // JUDGING PROGRESS
  // =========================================================

  get scoredParticipants(): number {

    return new Set(
      this.scores.map(
        score =>
          score.participantId
      )
    ).size;

  }


  get completedParticipants(): number {

    const participantIds =
      new Set(
        this.scores.map(
          score =>
            score.participantId
        )
      );


    let completed = 0;


    participantIds.forEach(
      participantId => {

        const participantScores =
          this.scores.filter(
            score =>
              score.participantId ===
              participantId
          );


        const hasMemorization =
          participantScores.some(
            score =>
              score.judgeType ===
              'MEMORIZATION'
          );


        const hasTajweed =
          participantScores.some(
            score =>
              score.judgeType ===
              'TAJWEED'
          );


        const hasMakharij =
          participantScores.some(
            score =>
              score.judgeType ===
              'MAKHARIJ'
          );


        if (
          hasMemorization &&
          hasTajweed &&
          hasMakharij
        ) {

          completed++;

        }

      }
    );


    return completed;

  }


  get judgingProgress(): number {

    if (
      this.totalParticipants === 0
    ) {

      return 0;

    }


    return Math.round(
      (
        this.completedParticipants /
        this.totalParticipants
      ) * 100
    );

  }


  // =========================================================
  // SCORE COMPONENT COUNTS
  // =========================================================

  get memorizationScores(): number {

    return this.scores.filter(
      score =>
        score.judgeType ===
        'MEMORIZATION'
    ).length;

  }


  get tajweedScores(): number {

    return this.scores.filter(
      score =>
        score.judgeType ===
        'TAJWEED'
    ).length;

  }


  get makharijScores(): number {

    return this.scores.filter(
      score =>
        score.judgeType ===
        'MAKHARIJ'
    ).length;

  }


  // =========================================================
  // SCORE CHART
  // =========================================================

  get maxScoreCount(): number {

    return Math.max(
      this.memorizationScores,
      this.tajweedScores,
      this.makharijScores,
      1
    );

  }


  get memorizationHeight(): number {

    return (
      this.memorizationScores /
      this.maxScoreCount
    ) * 100;

  }


  get tajweedHeight(): number {

    return (
      this.tajweedScores /
      this.maxScoreCount
    ) * 100;

  }


  get makharijHeight(): number {

    return (
      this.makharijScores /
      this.maxScoreCount
    ) * 100;

  }


  // =========================================================
  // JUZUU DISTRIBUTION
  // =========================================================

  get juzuuDistribution() {

    const map =
      new Map<string, number>();


    this.participants.forEach(
      participant => {

        const juzuu =
          participant.juzuu;

        map.set(
          juzuu,
          (map.get(juzuu) ?? 0) + 1
        );

      }
    );


    return Array
      .from(map.entries())
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .slice(0, 6)
      .map(
        ([juzuu, count]) => ({

          juzuu,

          count,

          percentage:
            this.totalParticipants > 0
              ? (
                  count /
                  this.totalParticipants
                ) * 100
              : 0

        })
      );

  }


  // =========================================================
  // COMPETITION STATUS
  // =========================================================

  get upcomingCompetitions(): number {

    return this.competitions.filter(
      competition =>
        competition.status === 'UPCOMING'
    ).length;

  }


  get completedCompetitions(): number {

    return this.competitions.filter(
      competition =>
        competition.status === 'COMPLETED'
    ).length;

  }


  // =========================================================
  // RECENT PARTICIPANTS
  // =========================================================

  get recentParticipants(): Participant[] {

    return [
      ...this.participants
    ]
      .reverse()
      .slice(0, 5);

  }


  // =========================================================
  // FORMAT JUZUU
  // =========================================================

  formatJuzuu(
    juzuu: string
  ): string {

    return juzuu
      ?.replace(
        'JUZUU_',
        'Juzuu '
      ) ?? '';

  }


  // =========================================================
  // REFRESH
  // =========================================================

  refreshDashboard(): void {

    this.loadDashboard();

  }

}