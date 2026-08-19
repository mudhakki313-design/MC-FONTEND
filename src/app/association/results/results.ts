import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  JudgeType,
  Juzuu,
  Result,
  ResultService,
  Score
} from '../../services/result.service';


// =========================================================
// COMPETITION OPTION
// =========================================================

export interface CompetitionOption {

  id: number;

  title: string;

}


@Component({
  selector: 'app-results',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './results.html',

  styleUrl: './results.css'
})
export class Results implements OnInit {


  // =========================================================
  // DATA
  // =========================================================

  scores: Score[] = [];

  filteredScores: Score[] = [];

  results: Result[] = [];

  filteredResults: Result[] = [];


  // =========================================================
  // FILTERS
  // =========================================================

  searchTerm = '';

  selectedCompetitionId: number | 'ALL' = 'ALL';

  selectedJuzuu: Juzuu | 'ALL' = 'ALL';

  selectedJudgeType: JudgeType | 'ALL' = 'ALL';


  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  competitions: CompetitionOption[] = [];

  juzuuList: Juzuu[] = [];

  judgeTypes: JudgeType[] = [

    'MEMORIZATION',

    'TAJWEED',

    'MAKHARIJ'

  ];


  // =========================================================
  // LOADING
  // =========================================================

  loading = false;

  resultsLoading = false;

  scoreWindowLoading = false;


  // =========================================================
  // SCORE WINDOW
  // =========================================================

  showScoreWindow = false;

  scoreWindowTab:
    | 'overview'
    | 'scores'
    | 'result' = 'overview';

  selectedParticipant: Result | null = null;

  selectedScores: Score[] = [];


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private resultService: ResultService,

    private cdr: ChangeDetectorRef
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadScores();

  }


  // =========================================================
  // SUMMARY
  // =========================================================

  get scoredCount(): number {

    return new Set(
      this.scores.map(
        score => score.participantId
      )
    ).size;

  }


  get highestScore(): number {

    if (this.results.length === 0) {

      return 0;

    }

    return Math.max(
      ...this.results.map(
        result => result.totalScore
      )
    );

  }


  get completionPercentage(): number {

    if (this.scores.length === 0) {

      return 0;

    }


    const participantIds =
      new Set(
        this.scores.map(
          score => score.participantId
        )
      );


    if (participantIds.size === 0) {

      return 0;

    }


    let completed = 0;


    participantIds.forEach(
      participantId => {

        const participantScores =
          this.scores.filter(
            score =>
              score.participantId === participantId
          );


        const memorization =
          participantScores.some(
            score =>
              score.judgeType === 'MEMORIZATION'
          );


        const tajweed =
          participantScores.some(
            score =>
              score.judgeType === 'TAJWEED'
          );


        const makharij =
          participantScores.some(
            score =>
              score.judgeType === 'MAKHARIJ'
          );


        if (
          memorization &&
          tajweed &&
          makharij
        ) {

          completed++;

        }

      }
    );


    return Math.round(
      (completed / participantIds.size) * 100
    );

  }


  // =========================================================
  // LOAD SCORES
  // =========================================================

  loadScores(): void {

    this.loading = true;


    this.resultService
      .getAllScores()
      .subscribe({

        next: (data) => {

          this.scores = data ?? [];

          this.buildFilters();

          this.applyScoreFilters();

          this.loading = false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load scores:',
            error
          );

          this.scores = [];

          this.filteredScores = [];

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // BUILD FILTERS
  // =========================================================

  buildFilters(): void {

    const competitionMap =
      new Map<number, string>();


    this.scores.forEach(
      score => {

        if (
          score.competitionId &&
          score.competition
        ) {

          competitionMap.set(
            score.competitionId,
            score.competition
          );

        }

      }
    );


    this.competitions =
      Array.from(
        competitionMap.entries()
      )
      .map(
        ([id, title]) => ({

          id,

          title

        })
      );


    this.juzuuList = [
      ...new Set(
        this.scores
          .map(
            score => score.juzuu
          )
          .filter(Boolean)
      )
    ] as Juzuu[];

  }


  // =========================================================
  // COMPETITION CHANGE
  // =========================================================

  onCompetitionChange(): void {

    this.results = [];

    this.filteredResults = [];


    if (
      this.selectedCompetitionId === 'ALL'
    ) {

      return;

    }


    if (
      this.selectedJuzuu !== 'ALL'
    ) {

      this.loadResults();

    }

  }


  // =========================================================
  // JUZUU CHANGE
  // =========================================================

  onJuzuuChange(): void {

    this.results = [];

    this.filteredResults = [];


    if (
      this.selectedCompetitionId === 'ALL' ||
      this.selectedJuzuu === 'ALL'
    ) {

      return;

    }


    this.loadResults();

  }


  // =========================================================
  // APPLY SCORE FILTERS
  // =========================================================

  applyScoreFilters(): void {

    const search =
      this.searchTerm
        .toLowerCase()
        .trim();


    this.filteredScores =
      this.scores.filter(
        score => {

          const matchesSearch =
            !search ||

            score.participant
              ?.toLowerCase()
              .includes(search) ||

            score.madrasa
              ?.toLowerCase()
              .includes(search);


          const matchesCompetition =
            this.selectedCompetitionId === 'ALL' ||

            score.competitionId ===
            this.selectedCompetitionId;


          const matchesJuzuu =
            this.selectedJuzuu === 'ALL' ||

            score.juzuu ===
            this.selectedJuzuu;


          const matchesJudge =
            this.selectedJudgeType === 'ALL' ||

            score.judgeType ===
            this.selectedJudgeType;


          return (
            matchesSearch &&
            matchesCompetition &&
            matchesJuzuu &&
            matchesJudge
          );

        }
      );

  }


  // =========================================================
  // LOAD SAVED RESULTS
  // =========================================================

  loadResults(): void {

    if (
      this.selectedCompetitionId === 'ALL' ||
      this.selectedJuzuu === 'ALL'
    ) {

      this.results = [];

      this.filteredResults = [];

      return;

    }


    this.resultsLoading = true;


    this.resultService
      .getCompetitionResults(
        this.selectedCompetitionId,
        this.selectedJuzuu
      )
      .subscribe({

        next: (data) => {

          this.results = data ?? [];

          this.filteredResults =
            [...this.results];

          this.resultsLoading = false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load results:',
            error
          );

          this.results = [];

          this.filteredResults = [];

          this.resultsLoading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // APPLY RESULT SEARCH
  // =========================================================

  applyResultFilters(): void {

    const search =
      this.searchTerm
        .toLowerCase()
        .trim();


    this.filteredResults =
      this.results.filter(
        result => {

          return (

            !search ||

            result.participant
              ?.toLowerCase()
              .includes(search) ||

            result.madrasa
              ?.toLowerCase()
              .includes(search)

          );

        }
      );

  }


  // =========================================================
  // OPEN SCORE WINDOW
  // =========================================================

  openScoreWindow(
    result: Result
  ): void {

    this.selectedParticipant =
      result;

    this.selectedScores = [];

    this.scoreWindowTab =
      'overview';

    this.showScoreWindow =
      true;

    this.scoreWindowLoading =
      true;


    this.resultService
      .getParticipantScores(
        result.participantId
      )
      .subscribe({

        next: (data) => {

          this.selectedScores =
            data ?? [];

          this.scoreWindowLoading =
            false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load participant scores:',
            error
          );

          this.selectedScores = [];

          this.scoreWindowLoading =
            false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // CLOSE SCORE WINDOW
  // =========================================================

  closeScoreWindow(): void {

    this.showScoreWindow =
      false;

    this.selectedParticipant =
      null;

    this.selectedScores = [];

    this.scoreWindowTab =
      'overview';

  }


  // =========================================================
  // GET SCORE BY TYPE
  // =========================================================

  getScoreByType(
    type: JudgeType
  ): number {

    const score =
      this.selectedScores.find(
        item =>
          item.judgeType === type
      );


    return score?.score ?? 0;

  }


  // =========================================================
  // TOTAL SCORE
  // =========================================================

  getTotalScore(): number {

    return this.selectedScores.reduce(
      (
        total,
        item
      ) =>
        total + item.score,

      0
    );

  }


  // =========================================================
  // MAXIMUM SCORE
  // =========================================================

  getMaximumScore(
    judgeType: JudgeType
  ): number {

    switch (judgeType) {

      case 'MEMORIZATION':
        return 50;

      case 'TAJWEED':
        return 30;

      case 'MAKHARIJ':
        return 20;

      case 'CHIEF':
        return 100;

      default:
        return 0;

    }

  }


  // =========================================================
  // SCORE PERCENTAGE
  // =========================================================

  getScorePercentage(
    judgeType: JudgeType
  ): number {

    const score =
      this.getScoreByType(
        judgeType
      );


    const maximum =
      this.getMaximumScore(
        judgeType
      );


    if (maximum === 0) {

      return 0;

    }


    return (
      score / maximum
    ) * 100;

  }


  // =========================================================
  // FORMAT JUZUU
  // =========================================================

  formatJuzuu(
    juzuu: string
  ): string {

    return juzuu.replace(
      'JUZUU_',
      'JUZUU '
    );

  }


  // =========================================================
  // FORMAT JUDGE TYPE
  // =========================================================

  formatJudgeType(
    type: JudgeType
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