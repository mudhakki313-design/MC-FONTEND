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

  selectedParticipantId: number | null = null;


  competitions: string[] = [];

  madrasas: string[] = [];

  filteredParticipants: Participant[] = [];


  // =========================================================
  // SCORE
  // =========================================================

  score: number | null = null;


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
          .map(participant => participant.competition)
          .filter(Boolean)
      )
    ];

  }


  // =========================================================
  // COMPETITION CHANGE
  // =========================================================

  onCompetitionChange(): void {

    this.selectedMadrasa = null;

    this.selectedParticipantId = null;

    this.selectedParticipant = null;

    this.myScore = null;

    this.score = null;

    this.madrasas = [];

    this.filteredParticipants = [];


    if (!this.selectedCompetition) {
      return;
    }


    const competitionParticipants =
      this.participants.filter(
        participant =>
          participant.competition ===
          this.selectedCompetition
      );


    this.madrasas = [
      ...new Set(
        competitionParticipants
          .map(participant => participant.madrasa)
          .filter(Boolean)
      )
    ];

  }


  // =========================================================
  // MADRASA CHANGE
  // =========================================================

  onMadrasaChange(): void {

    this.selectedParticipantId = null;

    this.selectedParticipant = null;

    this.myScore = null;

    this.score = null;

    this.filteredParticipants = [];


    if (!this.selectedCompetition ||
        !this.selectedMadrasa) {

      return;

    }


    this.filteredParticipants =
      this.participants.filter(
        participant =>
          participant.competition ===
            this.selectedCompetition &&

          participant.madrasa ===
            this.selectedMadrasa
      );

  }


  // =========================================================
  // PARTICIPANT CHANGE
  // =========================================================

  onParticipantChange(): void {

    this.myScore = null;

    this.score = null;


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

            this.myScore = null;

            this.score = null;

          }

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
        'Please enter a score.'
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

        `Submit ${this.score} / ${this.maxScore} for ${this.selectedParticipant.fullName}?`,

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
            `Score ${response.score} has been successfully recorded.`
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

  }


  // =========================================================
  // RESET MADRASA
  // =========================================================

  clearMadrasa(): void {

    this.selectedMadrasa = null;

    this.selectedParticipantId = null;

    this.selectedParticipant = null;

    this.myScore = null;

    this.score = null;

    this.filteredParticipants = [];

  }


  // =========================================================
  // RESET EVERYTHING
  // =========================================================

  clearAll(): void {

    this.selectedCompetition = null;

    this.selectedMadrasa = null;

    this.selectedParticipantId = null;

    this.selectedParticipant = null;

    this.myScore = null;

    this.score = null;

    this.madrasas = [];

    this.filteredParticipants = [];

  }

}