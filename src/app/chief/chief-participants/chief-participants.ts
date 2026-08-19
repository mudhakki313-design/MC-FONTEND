import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Participant,
  ParticipantService,
  Juzuu,
  ParticipantStatus
} from '../../services/participant.service';

import {
  ResultService,
  Score
} from '../../services/result.service';

import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-chief-participants',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './chief-participants.html',
  styleUrl: './chief-participants.css',
})
export class ChiefParticipants implements OnInit {


  // =========================================================
  // DATA
  // =========================================================

  participants: Participant[] = [];

  filteredParticipants: Participant[] = [];

  scores: Score[] = [];


  // =========================================================
  // FILTERS
  // =========================================================

  searchTerm = '';

  selectedCompetition = 'ALL';

  selectedJuzuu: Juzuu | 'ALL' = 'ALL';

  selectedGender = 'ALL';

  selectedStatus: ParticipantStatus | 'ALL' = 'APPROVED';


  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  competitions: string[] = [];

  juzuuList: Juzuu[] = [];


  // =========================================================
  // UI STATE
  // =========================================================

  loading = false;

  scoreLoading = false;

  selectedParticipant: Participant | null = null;

  showDetails = false;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private participantService: ParticipantService,
    private resultService: ResultService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadParticipants();

  }


  // =========================================================
  // LOAD PARTICIPANTS
  // =========================================================

  loadParticipants(): void {

    this.loading = true;

    this.participantService
      .getAllParticipants()
      .subscribe({

        next: (data) => {

          this.participants = data ?? [];

          this.buildFilters();

          this.applyFilters();

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load participants:',
            error
          );

          this.participants = [];

          this.filteredParticipants = [];

          this.loading = false;

          this.alertService.error(
            'Failed to Load Participants',
            'Unable to retrieve participants from the server.'
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // BUILD FILTERS
  // =========================================================

  buildFilters(): void {

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


    this.juzuuList = [
      ...new Set(
        this.participants
          .map(
            participant =>
              participant.juzuu
          )
          .filter(Boolean)
      )
    ] as Juzuu[];

  }


  // =========================================================
  // APPLY FILTERS
  // =========================================================

  applyFilters(): void {

    const search =
      this.searchTerm
        .toLowerCase()
        .trim();


    this.filteredParticipants =
      this.participants.filter(
        participant => {


          // SEARCH

          const matchesSearch =
            !search ||

            participant.fullName
              ?.toLowerCase()
              .includes(search) ||

            participant.madrasa
              ?.toLowerCase()
              .includes(search) ||

            participant.competition
              ?.toLowerCase()
              .includes(search);


          // COMPETITION

          const matchesCompetition =
            this.selectedCompetition === 'ALL' ||

            participant.competition ===
            this.selectedCompetition;


          // JUZUU

          const matchesJuzuu =
            this.selectedJuzuu === 'ALL' ||

            participant.juzuu ===
            this.selectedJuzuu;


          // GENDER

          const matchesGender =
            this.selectedGender === 'ALL' ||

            participant.gender ===
            this.selectedGender;


          // STATUS

          const matchesStatus =
            this.selectedStatus === 'ALL' ||

            participant.status ===
            this.selectedStatus;


          return (
            matchesSearch &&
            matchesCompetition &&
            matchesJuzuu &&
            matchesGender &&
            matchesStatus
          );

        }
      );

  }


  // =========================================================
  // SEARCH
  // =========================================================

  onSearch(): void {

    this.applyFilters();

  }


  // =========================================================
  // RESET FILTERS
  // =========================================================

  resetFilters(): void {

    this.searchTerm = '';

    this.selectedCompetition = 'ALL';

    this.selectedJuzuu = 'ALL';

    this.selectedGender = 'ALL';

    this.selectedStatus = 'APPROVED';

    this.applyFilters();

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


  get maleParticipants(): number {

    return this.participants.filter(
      participant =>
        participant.gender === 'MALE'
    ).length;

  }


  get femaleParticipants(): number {

    return this.participants.filter(
      participant =>
        participant.gender === 'FEMALE'
    ).length;

  }


  // =========================================================
  // SCORE PROGRESS
  // =========================================================

  getScoreCount(
    participantId: number
  ): number {

    return this.scores.filter(
      score =>
        score.participantId ===
        participantId
    ).length;

  }


  isFullyScored(
    participantId: number
  ): boolean {

    return this.getScoreCount(
      participantId
    ) >= 3;

  }


  getScorePercentage(
    participantId: number
  ): number {

    const count =
      this.getScoreCount(
        participantId
      );

    return Math.round(
      (count / 3) * 100
    );

  }


  // =========================================================
  // LOAD SCORES
  // =========================================================

  loadScores(): void {

    this.scoreLoading = true;

    this.resultService
      .getAllScores()
      .subscribe({

        next: (data) => {

          this.scores = data ?? [];

          this.scoreLoading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load scores:',
            error
          );

          this.scores = [];

          this.scoreLoading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // OPEN PARTICIPANT DETAILS
  // =========================================================

  openDetails(
    participant: Participant
  ): void {

    this.selectedParticipant =
      participant;

    this.showDetails = true;

    this.loadParticipantScores(
      participant.id
    );

  }


  // =========================================================
  // PARTICIPANT SCORE DETAILS
  // =========================================================

  selectedScores: Score[] = [];


  loadParticipantScores(
    participantId: number
  ): void {

    this.selectedScores = [];

    this.scoreLoading = true;

    this.resultService
      .getParticipantScores(
        participantId
      )
      .subscribe({

        next: (data) => {

          this.selectedScores =
            data ?? [];

          this.scoreLoading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load participant scores:',
            error
          );

          this.selectedScores = [];

          this.scoreLoading = false;

          this.alertService.error(
            'Unable to Load Scores',
            'Participant scores could not be retrieved.'
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // CLOSE DETAILS
  // =========================================================

  closeDetails(): void {

    this.showDetails = false;

    this.selectedParticipant = null;

    this.selectedScores = [];

  }


  // =========================================================
  // SCORE BY TYPE
  // =========================================================

  getScoreByType(
    type:
      | 'MEMORIZATION'
      | 'TAJWEED'
      | 'MAKHARIJ'
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
        score
      ) =>
        total + score.score,
      0
    );

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
  // FORMAT STATUS
  // =========================================================

  formatStatus(
    status: ParticipantStatus
  ): string {

    switch (status) {

      case 'APPROVED':
        return 'Approved';

      case 'PENDING':
        return 'Pending';

      case 'REJECTED':
        return 'Rejected';

      default:
        return status;

    }

  }


  // =========================================================
  // FORMAT GENDER
  // =========================================================

  formatGender(
    gender: string
  ): string {

    return gender === 'MALE'
      ? 'Male'
      : 'Female';

  }

}