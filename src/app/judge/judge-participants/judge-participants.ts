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
  ParticipantService,
  Participant,
  Juzuu
} from '../../services/participant.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({

  selector: 'app-judge-participants',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './judge-participants.html',

  styleUrl: './judge-participants.css'

})
export class JudgeParticipants implements OnInit {


  // =========================================================
  // DATA
  // =========================================================

  participants: Participant[] = [];

  filteredParticipants: Participant[] = [];

  /**
   * Competition names are built directly
   * from Judge participants.
   */
  competitions: string[] = [];

  /**
   * Madrasa names are built directly
   * from Judge participants.
   */
  madrasas: string[] = [];


  // =========================================================
  // FILTERS
  // =========================================================

  selectedCompetition: string | null = null;

  selectedMadrasa: string | null = null;

  selectedJuzuu: Juzuu | null = null;


  // =========================================================
  // JUZUU LIST
  // =========================================================

  juzuuList: Juzuu[] = [

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
  // STATE
  // =========================================================

  loading = false;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(

    private participantService: ParticipantService,

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
      .getParticipantsForJudge()
      .subscribe({

        next: participants => {

          this.participants = participants;

          this.filteredParticipants = [
            ...participants
          ];


          // Build filter options from
          // the same Judge participant data.

          this.buildCompetitions();

          this.buildMadrasas();


          this.loading = false;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load judge participants:',
            error
          );

          this.loading = false;

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
  // BUILD MADRASAS
  // =========================================================

  private buildMadrasas(): void {

    this.madrasas = [

      ...new Set(

        this.participants

          .map(
            participant =>
              participant.madrasa
          )

          .filter(Boolean)

      )

    ];

  }


  // =========================================================
  // APPLY FILTERS
  // =========================================================

  applyFilters(): void {

    this.filteredParticipants =
      this.participants.filter(participant => {


        // =============================================
        // COMPETITION
        // =============================================

        const competitionMatch =

          this.selectedCompetition === null ||

          participant.competition ===
            this.selectedCompetition;


        // =============================================
        // MADRASA
        // =============================================

        const madrasaMatch =

          this.selectedMadrasa === null ||

          participant.madrasa ===
            this.selectedMadrasa;


        // =============================================
        // JUZUU
        // =============================================

        const juzuuMatch =

          this.selectedJuzuu === null ||

          participant.juzuu ===
            this.selectedJuzuu;


        // =============================================
        // FINAL RESULT
        // =============================================

        return (

          competitionMatch &&

          madrasaMatch &&

          juzuuMatch

        );

      });


    this.cdr.detectChanges();

  }


  // =========================================================
  // COMPETITION FILTER CHANGE
  // =========================================================

  onCompetitionChange(): void {

    this.applyFilters();

  }


  // =========================================================
  // MADRASA FILTER CHANGE
  // =========================================================

  onMadrasaChange(): void {

    this.applyFilters();

  }


  // =========================================================
  // JUZUU FILTER CHANGE
  // =========================================================

  onJuzuuChange(): void {

    this.applyFilters();

  }


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  clearFilters(): void {

    this.selectedCompetition = null;

    this.selectedMadrasa = null;

    this.selectedJuzuu = null;


    this.filteredParticipants = [
      ...this.participants
    ];


    this.cdr.detectChanges();

  }


  // =========================================================
  // CHECK FILTER STATE
  // =========================================================

  get hasFilters(): boolean {

    return (

      this.selectedCompetition !== null ||

      this.selectedMadrasa !== null ||

      this.selectedJuzuu !== null

    );

  }


  // =========================================================
  // JUZUU LABEL
  // =========================================================

  getJuzuuLabel(
    juzuu: string
  ): string {

    return juzuu
      .replace(
        'JUZUU_',
        'Juzuu '
      );

  }


  // =========================================================
  // COMPETITION TITLE
  // =========================================================

  getCompetitionTitle(
    competition: string
  ): string {

    return competition || '—';

  }


  // =========================================================
  // REFRESH
  // =========================================================

  refresh(): void {

    this.loadParticipants();

  }

}