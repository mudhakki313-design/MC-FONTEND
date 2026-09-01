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
  Competition,
  CompetitionService,
  CompetitionStatus
} from '../../services/competition.service';

import {
  Participant,
  ParticipantService,
  ParticipantStatus
} from '../../services/participant.service';

import {
  Madrasa,
  MadrasaService
} from '../../services/madrasa.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({

  selector: 'app-madrasa-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './madrasa-dashboard.html',

  styleUrl: './madrasa-dashboard.css'

})
export class MadrasaDashboard
  implements OnInit {


  // =====================================================
  // MADRASA
  // =====================================================

  madrasa: Madrasa | null = null;

  madrasaLoading = false;


  // =====================================================
  // PARTICIPANTS
  // =====================================================

  participants: Participant[] = [];

  participantsLoading = false;


  // =====================================================
  // COMPETITIONS
  // =====================================================

  competitions: Competition[] = [];

  competitionsLoading = false;


  // =====================================================
  // PAGE STATE
  // =====================================================

  loading = true;

  lastUpdated: Date | null = null;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private madrasaService:
      MadrasaService,

    private participantService:
      ParticipantService,

    private competitionService:
      CompetitionService,

    private alertService:
      AlertService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadDashboard();

  }


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  loadDashboard(): void {

    this.loading = true;

    this.loadMadrasa();

    this.loadParticipants();

    this.loadCompetitions();

  }


  // =====================================================
  // LOAD MADRASA
  // =====================================================

  private loadMadrasa(): void {

    this.madrasaLoading = true;

    this.madrasaService
      .getMyMadrasa()
      .subscribe({

        next: madrasa => {

          this.madrasa =
            madrasa;

          this.madrasaLoading =
            false;

          this.updateLoadingState();

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load madrasa:',
            error
          );

          this.madrasaLoading =
            false;

          this.updateLoadingState();

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD MY PARTICIPANTS
  // =====================================================

  private loadParticipants(): void {

    this.participantsLoading = true;

    this.participantService
      .getMyMadrasaParticipants()
      .subscribe({

        next: participants => {

          this.participants =
            participants ?? [];

          this.participantsLoading =
            false;

          this.updateLoadingState();

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load madrasa participants:',
            error
          );

          this.participants = [];

          this.participantsLoading =
            false;

          this.updateLoadingState();

          this.alertService.error(
            'Unable to Load Participants',
            'Participants for your madrasa could not be loaded.'
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD COMPETITIONS
  // =====================================================

  private loadCompetitions(): void {

    this.competitionsLoading = true;

    this.competitionService
      .getAllCompetitions()
      .subscribe({

        next: competitions => {

          this.competitions =
            competitions ?? [];

          this.competitionsLoading =
            false;

          this.updateLoadingState();

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load competitions:',
            error
          );

          this.competitions = [];

          this.competitionsLoading =
            false;

          this.updateLoadingState();

          this.alertService.error(
            'Unable to Load Competitions',
            'Competition information could not be loaded.'
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // LOADING STATE
  // =====================================================

  private updateLoadingState(): void {

    this.loading =
      this.madrasaLoading ||
      this.participantsLoading ||
      this.competitionsLoading;


    if (!this.loading) {

      this.lastUpdated =
        new Date();

    }

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refreshDashboard(): void {

    this.loadDashboard();

  }


  // =====================================================
  // PARTICIPANT COUNTS
  // =====================================================

  get totalParticipants(): number {

    return this.participants.length;

  }


  get approvedParticipants(): number {

    return this.countParticipantsByStatus(
      'APPROVED'
    );

  }


  get pendingParticipants(): number {

    return this.countParticipantsByStatus(
      'PENDING'
    );

  }


  get rejectedParticipants(): number {

    return this.countParticipantsByStatus(
      'REJECTED'
    );

  }


  private countParticipantsByStatus(
    status: ParticipantStatus
  ): number {

    return this.participants.filter(
      participant =>
        participant.status === status
    ).length;

  }


  // =====================================================
  // COMPETITION COUNTS
  // =====================================================

  get upcomingCompetitions(): Competition[] {

    return this.competitions
      .filter(
        competition =>
          competition.status === 'UPCOMING'
      )
      .sort(
        (a, b) =>
          this.dateValue(a.competitionDate) -
          this.dateValue(b.competitionDate)
      );

  }


  get ongoingCompetitions(): Competition[] {

    return this.competitions
      .filter(
        competition =>
          competition.status === 'ONGOING'
      );

  }


  get completedCompetitions(): Competition[] {

    return this.competitions
      .filter(
        competition =>
          competition.status === 'COMPLETED'
      );

  }


  get upcomingCount(): number {

    return this.upcomingCompetitions.length;

  }


  get ongoingCount(): number {

    return this.ongoingCompetitions.length;

  }


  // =====================================================
  // RECENT PARTICIPANTS
  // =====================================================

  get recentParticipants(): Participant[] {

    return this.participants
      .slice(0, 5);

  }


  // =====================================================
  // PARTICIPANT INITIAL
  // =====================================================

  getParticipantInitial(
    participant: Participant
  ): string {

    const name =
      participant.fullName?.trim();


    if (!name) {

      return '?';

    }


    return name
      .charAt(0)
      .toUpperCase();

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(
    status: ParticipantStatus
  ): string {

    switch (status) {

      case 'APPROVED':
        return 'approved';

      case 'REJECTED':
        return 'rejected';

      case 'PENDING':
      default:
        return 'pending';

    }

  }


  // =====================================================
  // COMPETITION STATUS CLASS
  // =====================================================

  getCompetitionStatusClass(
    status: CompetitionStatus
  ): string {

    switch (status) {

      case 'ONGOING':
        return 'ongoing';

      case 'COMPLETED':
        return 'completed';

      case 'UPCOMING':
      default:
        return 'upcoming';

    }

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


    return juzuu
      .replace('JUZUU_', 'Juzuu ');

  }


  // =====================================================
  // COMPETITION DATE
  // =====================================================

  formatCompetitionDate(
    date: string | null | undefined
  ): string {

    if (!date) {

      return 'Date not available';

    }


    const parsed =
      new Date(date);


    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {

      return date;

    }


    return parsed.toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  // =====================================================
  // DATE VALUE
  // =====================================================

  private dateValue(
    date: string | null | undefined
  ): number {

    if (!date) {

      return Number.MAX_SAFE_INTEGER;

    }


    const value =
      new Date(date).getTime();


    return Number.isNaN(value)
      ? Number.MAX_SAFE_INTEGER
      : value;

  }


  // =====================================================
  // PARTICIPANT COMPETITION
  // =====================================================

  getParticipantCompetition(
    participant: Participant
  ): string {

    return participant.competition ||
      'No competition';

  }


  // =====================================================
  // LAST UPDATED
  // =====================================================

  get lastUpdatedText(): string {

    if (!this.lastUpdated) {

      return 'Not updated yet';

    }


    return this.lastUpdated.toLocaleTimeString(
      'en-GB',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }

}