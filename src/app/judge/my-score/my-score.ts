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
  ResultService,
  Score,
  JudgeType
} from '../../services/result.service';

import {
  ParticipantService,
  Participant
} from '../../services/participant.service';

import {
  JudgeService,
  Judge
} from '../../services/judge.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({
  selector: 'app-my-score',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './my-score.html',

  styleUrl: './my-score.css'
})
export class MyScore implements OnInit {


  // =========================================================
  // DATA
  // =========================================================

  participants: Participant[] = [];

  selectedParticipant: Participant | null = null;

  myScore: Score | null = null;


  // =========================================================
  // FILTERS
  // =========================================================

  selectedCompetition: string | null = null;

  selectedMadrasa: string | null = null;

  /**
   * NEW:
   * Juzuu selected before participant.
   */
  selectedJuzuu: string | null = null;

  selectedParticipantId: number | null = null;


  competitions: string[] = [];

  madrasas: string[] = [];

  /**
   * NEW:
   * Juzuu available for selected competition + madrasa.
   */
  juzuuOptions: string[] = [];

  /**
   * Participants available after:
   * Competition + Madrasa + Juzuu filtering.
   */
  filteredParticipants: Participant[] = [];


  // =========================================================
  // SCORE
  // =========================================================

  score: number | null = null;

  deductions: number[] = [];


  // =========================================================
  // JUDGE
  // =========================================================

  currentJudge: Judge | null = null;

  judgeType: JudgeType | null = null;


  // =========================================================
  // STATE
  // =========================================================

  loadingJudge = false;

  loadingParticipants = false;

  loadingScore = false;

  submitting = false;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private resultService: ResultService,
    private participantService: ParticipantService,
    private judgeService: JudgeService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadCurrentJudge();

    this.loadParticipants();

  }


  // =========================================================
  // LOAD CURRENT JUDGE
  // =========================================================

  loadCurrentJudge(): void {

    this.loadingJudge = true;

    this.judgeService
      .getCurrentJudge()
      .subscribe({

        next: judge => {

          this.currentJudge = judge;

          this.judgeType = judge.judgeType;

          this.loadingJudge = false;

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

        }

      });

  }


  // =========================================================
  // LOAD PARTICIPANTS
  // =========================================================

  loadParticipants(): void {

    this.loadingParticipants = true;

    this.participantService
      .getParticipantsForJudge()
      .subscribe({

        next: participants => {

          this.participants = participants;

          this.buildCompetitions();

          this.loadingParticipants = false;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load participants:',
            error
          );

          this.loadingParticipants = false;

          this.alertService.error(
            'Unable to Load Participants',
            'Approved participants could not be loaded.'
          );

        }

      });

  }


  // =========================================================
  // BUILD COMPETITIONS
  // =========================================================

  private buildCompetitions(): void {

    this.competitions = [
      ...new Set(

        this.participants

          .map(
            participant =>
              participant.competition
          )

          .filter(Boolean)

      )
    ];

  }


  // =========================================================
  // COMPETITION CHANGE
  // =========================================================

  onCompetitionChange(): void {

    // Reset everything below competition

    this.selectedMadrasa = null;

    this.selectedJuzuu = null;

    this.selectedParticipantId = null;

    this.selectedParticipant = null;

    this.myScore = null;

    this.score = null;

    this.deductions = [];

    this.madrasas = [];

    this.juzuuOptions = [];

    this.filteredParticipants = [];


    if (!this.selectedCompetition) {
      return;
    }


    // Get participants belonging to selected competition

    const competitionParticipants =
      this.participants.filter(
        participant =>
          participant.competition ===
          this.selectedCompetition
      );


    // Build madrasa list

    this.madrasas = [
      ...new Set(

        competitionParticipants

          .map(
            participant =>
              participant.madrasa
          )

          .filter(Boolean)

      )
    ];


    this.cdr.detectChanges();

  }


  // =========================================================
  // MADRASA CHANGE
  // =========================================================

  onMadrasaChange(): void {

    // Reset everything below madrasa

    this.selectedJuzuu = null;

    this.selectedParticipantId = null;

    this.selectedParticipant = null;

    this.myScore = null;

    this.score = null;

    this.deductions = [];

    this.juzuuOptions = [];

    this.filteredParticipants = [];


    if (
      !this.selectedCompetition ||
      !this.selectedMadrasa
    ) {

      return;

    }


    // Get participants belonging to:
    // Competition + Madrasa

    const madrasaParticipants =
      this.participants.filter(

        participant =>

          participant.competition ===
            this.selectedCompetition &&

          participant.madrasa ===
            this.selectedMadrasa

      );


    // Build Juzuu list

    this.juzuuOptions = [
      ...new Set(

        madrasaParticipants

          .map(
            participant =>
              participant.juzuu
          )

          .filter(Boolean)

      )
    ];


    this.cdr.detectChanges();

  }


  // =========================================================
  // JUZUU CHANGE
  // =========================================================

  onJuzuuChange(): void {

    // Reset participant whenever Juzuu changes

    this.selectedParticipantId = null;

    this.selectedParticipant = null;

    this.myScore = null;

    this.score = null;

    this.deductions = [];

    this.filteredParticipants = [];


    if (
      !this.selectedCompetition ||
      !this.selectedMadrasa ||
      !this.selectedJuzuu
    ) {

      return;

    }


    // IMPORTANT:
    //
    // Participant must belong to:
    //
    // Competition
    // +
    // Madrasa
    // +
    // Juzuu

    this.filteredParticipants =
      this.participants.filter(

        participant =>

          participant.competition ===
            this.selectedCompetition &&

          participant.madrasa ===
            this.selectedMadrasa &&

          participant.juzuu ===
            this.selectedJuzuu

      );


    this.cdr.detectChanges();

  }


  // =========================================================
  // PARTICIPANT CHANGE
  // =========================================================

  onParticipantChange(): void {

    this.myScore = null;

    this.score = null;

    this.deductions = [];


    this.selectedParticipant =
      this.filteredParticipants.find(

        participant =>

          participant.id ===
          this.selectedParticipantId

      ) ?? null;


    if (!this.selectedParticipant) {
      return;
    }


    this.loadExistingScore(
      this.selectedParticipant.id
    );

  }


  // =========================================================
  // LOAD EXISTING SCORE
  // =========================================================

  loadExistingScore(
    participantId: number
  ): void {

    this.loadingScore = true;

    this.resultService
      .getParticipantScores(participantId)
      .subscribe({

        next: scores => {

          if (scores.length > 0) {

            this.myScore = scores[0];

            this.score = scores[0].score;

          } else {

            // New participant starts
            // with full marks.

            this.myScore = null;

            this.score = this.maxScore;

          }


          this.deductions = [];

          this.loadingScore = false;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load participant score:',
            error
          );

          this.loadingScore = false;

          this.alertService.error(
            'Unable to Load Score',
            'The participant score could not be loaded.'
          );

        }

      });

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
        return 'Score';

    }

  }


  // =========================================================
  // CURRENT SCORE
  // =========================================================

  get currentScore(): number {

    return this.score ?? this.maxScore;

  }


  // =========================================================
  // TOTAL DEDUCTION
  // =========================================================

  get totalDeduction(): number {

    return this.deductions.reduce(

      (total, deduction) =>
        total + deduction,

      0

    );

  }


  // =========================================================
  // FORMAT SCORE
  // =========================================================

  formatScore(value: number): string {

    if (Number.isInteger(value)) {

      return value.toString();

    }

    return value

      .toFixed(2)

      .replace(
        /\.?0+$/,
        ''
      );

  }


  // =========================================================
  // DEDUCT SCORE
  // =========================================================

  deductMarks(
    deduction: number
  ): void {

    if (!this.selectedParticipant) {
      return;
    }


    if (this.myScore) {

      this.alertService.info(
        'Score Already Submitted',
        'This participant already has a submitted score.'
      );

      return;

    }


    const current =
      this.score ?? this.maxScore;


    if (current <= 0) {

      this.alertService.warning(
        'No Marks Remaining',
        'The participant score cannot go below zero.'
      );

      return;

    }


    const actualDeduction =
      Math.min(
        deduction,
        current
      );


    this.score =
      Number(

        (
          current -
          actualDeduction
        ).toFixed(2)

      );


    this.deductions.push(
      actualDeduction
    );


    this.cdr.detectChanges();

  }


  // =========================================================
  // UNDO LAST DEDUCTION
  // =========================================================

  undoLastDeduction(): void {

    if (
      this.myScore ||
      this.deductions.length === 0
    ) {

      return;

    }


    const lastDeduction =
      this.deductions.pop();


    if (lastDeduction === undefined) {
      return;
    }


    this.score =
      Number(

        (

          (this.score ?? 0) +
          lastDeduction

        ).toFixed(2)

      );


    this.cdr.detectChanges();

  }


  // =========================================================
  // RESET SCORE
  // =========================================================

  resetScore(): void {

    if (this.myScore) {
      return;
    }


    this.score = this.maxScore;

    this.deductions = [];

    this.cdr.detectChanges();

  }


  // =========================================================
  // SUBMIT SCORE
  // =========================================================

  async submitScore(): Promise<void> {

    if (!this.selectedParticipant) {

      this.alertService.warning(
        'Participant Required',
        'Please select a participant first.'
      );

      return;

    }


    if (!this.judgeType) {

      this.alertService.error(
        'Judge Type Not Found',
        'Your judging category could not be determined.'
      );

      return;

    }


    if (
      this.score === null ||
      this.score === undefined ||
      Number.isNaN(this.score)
    ) {

      this.alertService.warning(
        'Score Required',
        'Please evaluate the participant before submitting.'
      );

      return;

    }


    if (this.score < 0) {

      this.alertService.warning(
        'Invalid Score',
        'Score cannot be negative.'
      );

      return;

    }


    if (this.score > this.maxScore) {

      this.alertService.warning(
        'Invalid Score',
        `The maximum ${this.scoreCategory} score is ${this.maxScore}.`
      );

      return;

    }


    if (this.myScore) {

      this.alertService.info(
        'Score Already Submitted',
        'You have already submitted a score for this participant.'
      );

      return;

    }


    const confirmed =
      await this.alertService.confirm(

        'Submit Score?',

        `Submit ${this.formatScore(this.score)} / ${this.maxScore} for ${this.selectedParticipant.fullName}?`,

        'Submit Score'

      );


    if (!confirmed) {
      return;
    }


    this.submitting = true;

    this.alertService.loading(
      'Submitting score...'
    );


    this.resultService
      .createScore({

        participantId:
          this.selectedParticipant.id,

        score:
          Number(this.score)

      })
      .subscribe({

        next: response => {

          this.alertService.close();

          this.submitting = false;

          this.myScore = response;

          this.score = response.score;

          this.alertService.success(

            'Score Submitted',

            `Score ${this.formatScore(response.score)} has been successfully recorded.`

          );

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to submit score:',
            error
          );

          this.alertService.close();

          this.submitting = false;


          const message =
            error?.error?.message ??
            'The score could not be submitted.';


          this.alertService.error(
            'Submission Failed',
            message
          );

        }

      });

  }


  // =========================================================
  // RESET PARTICIPANT
  // =========================================================

  clearParticipant(): void {

    this.selectedParticipantId = null;

    this.selectedParticipant = null;

    this.myScore = null;

    this.score = null;

    this.deductions = [];

  }


  // =========================================================
  // RESET MADRASA
  // =========================================================

  clearMadrasa(): void {

    this.selectedMadrasa = null;

    this.selectedJuzuu = null;

    this.selectedParticipantId = null;

    this.selectedParticipant = null;

    this.myScore = null;

    this.score = null;

    this.deductions = [];

    this.juzuuOptions = [];

    this.filteredParticipants = [];

  }


  // =========================================================
  // RESET EVERYTHING
  // =========================================================

  clearAll(): void {

    this.selectedCompetition = null;

    this.selectedMadrasa = null;

    this.selectedJuzuu = null;

    this.selectedParticipantId = null;

    this.selectedParticipant = null;

    this.myScore = null;

    this.score = null;

    this.deductions = [];

    this.madrasas = [];

    this.juzuuOptions = [];

    this.filteredParticipants = [];

  }

}