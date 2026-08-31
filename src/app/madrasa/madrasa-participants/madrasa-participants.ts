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
  ParticipantRequest,
  Gender,
  Juzuu
} from '../../services/participant.service';

import {
  Competition,
  CompetitionService
} from '../../services/competition.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({

  selector: 'app-madrasa-participants',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './madrasa-participants.html',

  styleUrl: './madrasa-participants.css'

})
export class MadrasaParticipants
  implements OnInit {


  // =====================================================
  // DATA
  // =====================================================

  participants: Participant[] = [];

  filteredParticipants: Participant[] = [];

  competitions: Competition[] = [];


  // =====================================================
  // STATE
  // =====================================================

  loading = false;

  competitionLoading = false;

  saving = false;

  deleting = false;

  showModal = false;

  editMode = false;

  selectedParticipant:
    Participant | null = null;


  // =====================================================
  // SEARCH
  // =====================================================

  searchTerm = '';


  // =====================================================
  // FORM
  // =====================================================

  fullName = '';

  gender: Gender = 'MALE';

  age: number | null = null;

  juzuu: Juzuu = 'JUZUU_1';

  competitionId: number | null = null;


  // =====================================================
  // JUZUU
  // =====================================================

  juzuuList: Juzuu[] = Array.from(
    { length: 30 },
    (_, index) =>
      `JUZUU_${index + 1}` as Juzuu
  );


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

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

    this.loadParticipants();

    this.loadCompetitions();

  }


  // =====================================================
  // LOAD PARTICIPANTS
  // =====================================================

  loadParticipants(): void {

    this.loading = true;

    this.participantService
      .getMyMadrasaParticipants()
      .subscribe({

        next: participants => {

          this.participants =
            participants ?? [];

          this.applyFilter();

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load madrasa participants:',
            error
          );

          this.loading = false;

          this.alertService.error(
            'Unable to Load Participants',
            this.getBackendError(
              error,
              'Participants for your madrasa could not be loaded.'
            )
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD COMPETITIONS
  // =====================================================

  loadCompetitions(): void {

    this.competitionLoading = true;

    this.competitionService
      .getAllCompetitions()
      .subscribe({

        next: competitions => {

          this.competitions =
            competitions ?? [];

          this.competitionLoading = false;

          /*
           * If edit modal is already open,
           * resolve competition again.
           */
          if (
            this.editMode &&
            this.selectedParticipant
          ) {

            this.setCompetitionForEdit(
              this.selectedParticipant
            );

          }

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load competitions:',
            error
          );

          this.competitionLoading = false;

          this.alertService.error(
            'Unable to Load Competitions',
            this.getBackendError(
              error,
              'Competitions could not be loaded.'
            )
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // SEARCH
  // =====================================================

  applyFilter(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    if (!search) {

      this.filteredParticipants =
        [...this.participants];

      return;

    }


    this.filteredParticipants =
      this.participants.filter(
        participant => {

          return (

            participant.fullName
              ?.toLowerCase()
              .includes(search)

            ||

            participant.competition
              ?.toLowerCase()
              .includes(search)

            ||

            participant.madrasa
              ?.toLowerCase()
              .includes(search)

            ||

            participant.gender
              ?.toLowerCase()
              .includes(search)

          );

        }

      );

  }


  // =====================================================
  // OPEN ADD
  // =====================================================

  openAdd(): void {

    if (this.competitionLoading) {

      this.alertService.warning(
        'Please Wait',
        'Competition information is still loading.'
      );

      return;

    }


    if (this.competitions.length === 0) {

      this.alertService.warning(
        'No Competitions Available',
        'There are currently no competitions available for registration.'
      );

      return;

    }


    this.editMode = false;

    this.selectedParticipant = null;

    this.resetForm();

    this.showModal = true;

  }


  // =====================================================
  // OPEN EDIT
  // =====================================================

  openEdit(
    participant: Participant
  ): void {

    if (this.saving) {

      return;

    }


    this.editMode = true;

    this.selectedParticipant =
      participant;


    this.fullName =
      participant.fullName;

    this.gender =
      participant.gender;

    this.age =
      participant.age;

    this.juzuu =
      participant.juzuu;


    this.setCompetitionForEdit(
      participant
    );


    this.showModal = true;

  }


  // =====================================================
  // SET COMPETITION FOR EDIT
  // =====================================================

  private setCompetitionForEdit(
    participant: Participant
  ): void {

    if (
      !participant.competition ||
      this.competitions.length === 0
    ) {

      this.competitionId = null;

      return;

    }


    const participantCompetition =
      participant.competition
        .trim()
        .toLowerCase();


    const competition =
      this.competitions.find(
        c =>
          c.title
            ?.trim()
            .toLowerCase() ===
          participantCompetition
      );


    this.competitionId =
      competition
        ? competition.id
        : null;


    if (!competition) {

      console.warn(
        'Could not resolve competition ID:',
        participant.competition
      );

    }

  }


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  closeModal(): void {

    /*
     * Don't allow closing while request
     * is currently being submitted.
     */
    if (this.saving) {

      return;

    }


    this.showModal = false;

    this.selectedParticipant = null;

    this.resetForm();

  }


  // =====================================================
  // RESET FORM
  // =====================================================

  private resetForm(): void {

    this.fullName = '';

    this.gender = 'MALE';

    this.age = null;

    this.juzuu = 'JUZUU_1';

    this.competitionId = null;

  }


  // =====================================================
  // SAVE PARTICIPANT
  // =====================================================

  saveParticipant(): void {

    if (this.saving) {

      return;

    }


    // ===================================================
    // NAME
    // ===================================================

    const name =
      this.fullName.trim();


    if (!name) {

      this.alertService.warning(
        'Full Name Required',
        'Please enter participant full name.'
      );

      return;

    }


    // ===================================================
    // AGE
    // ===================================================

    if (
      this.age === null ||
      this.age <= 0
    ) {

      this.alertService.warning(
        'Age Required',
        'Please enter a valid participant age.'
      );

      return;

    }


    // ===================================================
    // COMPETITION
    // ===================================================

    /*
     * Backend ParticipantRequest has:
     *
     * @NotNull
     * competitionId
     *
     * Therefore BOTH CREATE and UPDATE
     * require competitionId.
     */
    if (
      this.competitionId === null ||
      this.competitionId === undefined
    ) {

      this.alertService.warning(
        'Competition Required',
        'Please select a competition before saving the participant.'
      );

      return;

    }


    // ===================================================
    // REQUEST
    // ===================================================

    const request: ParticipantRequest = {

      fullName: name,

      gender: this.gender,

      age: this.age,

      juzuu: this.juzuu,

      competitionId:
        this.competitionId,

      /*
       * Madrasa is derived from
       * authenticated user on backend.
       */
      madrasaId: 0

    };


    console.log(
      'Participant request:',
      request
    );


    this.saving = true;

    this.cdr.detectChanges();


    // ===================================================
    // UPDATE
    // ===================================================

    if (
      this.editMode &&
      this.selectedParticipant
    ) {

      const participantId =
        this.selectedParticipant.id;


      this.participantService
        .updateMadrasaParticipant(
          participantId,
          request
        )
        .subscribe({

          next: updated => {

            console.log(
              'Participant updated:',
              updated
            );


            const index =
              this.participants.findIndex(
                p =>
                  p.id === updated.id
              );


            if (index !== -1) {

              this.participants[index] =
                updated;

            }


            this.applyFilter();


            /*
             * IMPORTANT:
             * Stop spinner BEFORE closing modal.
             */
            this.saving = false;

            this.showModal = false;

            this.selectedParticipant = null;

            this.resetForm();


            this.cdr.detectChanges();


            this.alertService.success(
              'Participant Updated',
              'Participant information has been updated successfully.'
            );

          },


          error: error => {

            console.error(
              'Update participant failed:',
              error
            );


            /*
             * ALWAYS stop spinner on error.
             */
            this.saving = false;


            this.cdr.detectChanges();


            const message =
              this.getBackendError(
                error,
                'Participant could not be updated.'
              );


            if (error?.status === 403) {

              this.alertService.error(
                'Update Access Denied',
                'Your madrasa account is not authorized to update this participant.'
              );

            } else {

              this.alertService.error(
                'Update Failed',
                message
              );

            }

          }

        });


      return;

    }


    // ===================================================
    // CREATE
    // ===================================================

    this.participantService
      .createMadrasaParticipant(
        request
      )
      .subscribe({

        next: participant => {

          console.log(
            'Participant created:',
            participant
          );


          this.participants.unshift(
            participant
          );


          this.applyFilter();


          this.saving = false;

          this.showModal = false;

          this.selectedParticipant = null;

          this.resetForm();


          this.cdr.detectChanges();


          this.alertService.success(
            'Participant Added',
            'Participant has been added successfully.'
          );

        },


        error: error => {

          console.error(
            'Create participant failed:',
            error
          );


          /*
           * ALWAYS stop spinner.
           */
          this.saving = false;


          this.cdr.detectChanges();


          const message =
            this.getBackendError(
              error,
              'Participant could not be added.'
            );


          if (error?.status === 403) {

            this.alertService.error(
              'Add Access Denied',
              'Your madrasa account is not authorized to register participants.'
            );

          } else {

            this.alertService.error(
              'Add Failed',
              message
            );

          }

        }

      });

  }


  // =====================================================
  // DELETE PARTICIPANT
  // =====================================================

  async deleteParticipant(
    participant: Participant
  ): Promise<void> {

    if (this.deleting) {

      return;

    }


    // ===================================================
    // SWEETALERT CONFIRMATION
    // ===================================================

    const confirmed =
      await this.alertService.confirm(
        'Delete Participant?',
        `Are you sure you want to delete ${participant.fullName}? This action cannot be undone.`,
        'Yes, Delete'
      );


    if (!confirmed) {

      return;

    }


    // ===================================================
    // DELETE
    // ===================================================

    this.deleting = true;

    this.cdr.detectChanges();


    this.participantService
      .deleteMadrasaParticipant(
        participant.id
      )
      .subscribe({

        next: () => {

          this.participants =
            this.participants.filter(
              p =>
                p.id !== participant.id
            );


          this.applyFilter();


          this.deleting = false;


          this.cdr.detectChanges();


          this.alertService.success(
            'Participant Deleted',
            `${participant.fullName} has been deleted successfully.`
          );

        },


        error: error => {

          console.error(
            'Delete participant failed:',
            error
          );


          this.deleting = false;


          this.cdr.detectChanges();


          const message =
            this.getBackendError(
              error,
              'Participant could not be deleted.'
            );


          if (error?.status === 403) {

            this.alertService.error(
              'Delete Access Denied',
              'Your madrasa account is not authorized to delete this participant.'
            );

          } else {

            this.alertService.error(
              'Delete Failed',
              message
            );

          }

        }

      });

  }


  // =====================================================
  // STATUS LABEL
  // =====================================================

  getStatusLabel(
    status: string
  ): string {

    switch (status) {

      case 'APPROVED':
        return 'Approved';

      case 'REJECTED':
        return 'Rejected';

      case 'PENDING':
        return 'Pending';

      default:
        return status || 'Unknown';

    }

  }


  // =====================================================
  // JUZUU LABEL
  // =====================================================

  getJuzuuLabel(
    juzuu: string
  ): string {

    if (!juzuu) {

      return '—';

    }


    return juzuu.replace(
      'JUZUU_',
      'Juzuu '
    );

  }


  // =====================================================
  // COMPETITION LABEL
  // =====================================================

  getCompetitionLabel(
    competition: Competition
  ): string {

    if (!competition) {

      return 'Competition';

    }


    return competition.title;

  }


  // =====================================================
  // BACKEND ERROR
  // =====================================================

  private getBackendError(
    error: any,
    fallback: string
  ): string {

    if (
      error?.error?.message
    ) {

      return error.error.message;

    }


    if (
      error?.error?.detail
    ) {

      return error.error.detail;

    }


    if (
      error?.error?.errors
    ) {

      return error.error.errors;

    }


    if (
      typeof error?.error === 'string'
    ) {

      return error.error;

    }


    return fallback;

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refresh(): void {

    this.loadParticipants();

    this.loadCompetitions();

  }

}