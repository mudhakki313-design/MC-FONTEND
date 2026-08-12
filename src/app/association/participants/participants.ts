import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Participant,
  ParticipantRequest,
  ParticipantService,
  Juzuu,
  Gender
} from '../../services/participant.service';

import {
  Madrasa,
  MadrasaService
} from '../../services/madrasa.service';

import {
  Competition,
  CompetitionService
} from '../../services/competition.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({
  selector: 'app-participants',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './participants.html',

  styleUrl: './participants.css'
})
export class Participants implements OnInit {


  // =====================================
  // DATA
  // =====================================

  participants: Participant[] = [];

  filteredParticipants: Participant[] = [];

  madrasas: Madrasa[] = [];

  competitions: Competition[] = [];


  // =====================================
  // STATES
  // =====================================

  loading = false;

  saving = false;

  showForm = false;


  // =====================================
  // EDIT
  // =====================================

  editingId: number | null = null;


  // =====================================
  // FILTERS
  // =====================================

  searchTerm = '';

  selectedStatus = 'ALL';

  selectedJuzuu = 'ALL';


  // =====================================
  // FORM
  // =====================================

  form: ParticipantRequest = {

    fullName: '',

    gender: 'MALE',

    age: 5,

    juzuu: 'JUZUU_30',

    competitionId: 0,

    madrasaId: 0

  };


  // =====================================
  // JUZUU LIST
  // =====================================

  juzuuList: Juzuu[] = Array.from(
    { length: 30 },
    (_, index) =>
      `JUZUU_${index + 1}` as Juzuu
  );


  constructor(

    private participantService:
      ParticipantService,

    private madrasaService:
      MadrasaService,

    private competitionService:
      CompetitionService,

    private alert:
      AlertService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================
  // INIT
  // =====================================

  ngOnInit(): void {

    this.loadData();

  }


  // =====================================
  // LOAD ALL DATA
  // =====================================

  loadData(): void {

    this.loading = true;


    this.participantService
      .getAllParticipants()
      .subscribe({

        next: (data) => {

          this.participants = data;

          this.applyFilters();

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          this.loading = false;

          console.error(error);

          this.alert.error(
            'Failed to Load',
            error?.error?.message ??
            'Unable to load participants.'
          );

        }

      });


    this.madrasaService
      .getAllMadrasas()
      .subscribe({

        next: (data) => {

          this.madrasas = data;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(error);

        }

      });


    this.competitionService
      .getAllCompetitions()
      .subscribe({

        next: (data) => {

          this.competitions = data;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(error);

        }

      });

  }


  // =====================================
  // FILTER
  // =====================================

  applyFilters(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.filteredParticipants =
      this.participants.filter(
        participant => {


          const matchesSearch =

            !search ||

            participant.fullName
              .toLowerCase()
              .includes(search) ||

            participant.madrasa
              .toLowerCase()
              .includes(search) ||

            participant.competition
              .toLowerCase()
              .includes(search);


          const matchesStatus =

            this.selectedStatus === 'ALL' ||

            participant.status ===
              this.selectedStatus;


          const matchesJuzuu =

            this.selectedJuzuu === 'ALL' ||

            participant.juzuu ===
              this.selectedJuzuu;


          return (

            matchesSearch &&

            matchesStatus &&

            matchesJuzuu

          );

        }

      );

  }


  // =====================================
  // CREATE
  // =====================================

  openCreate(): void {

    this.editingId = null;

    this.resetForm();

    this.showForm = true;

  }


  // =====================================
  // EDIT
  // =====================================

  openEdit(
    participant: Participant
  ): void {

    /*
     * Backend ParticipantResponse
     * does not return competitionId
     * or madrasaId.
     *
     * Therefore we don't guess IDs here.
     *
     * For now editing will preserve
     * the currently selected references
     * only when we explicitly have them.
     */

    this.editingId =
      participant.id;

    this.form = {

      fullName:
        participant.fullName,

      gender:
        participant.gender,

      age:
        participant.age,

      juzuu:
        participant.juzuu,

      competitionId:
        0,

      madrasaId:
        0

    };

    this.showForm = true;

  }


  // =====================================
  // CLOSE
  // =====================================

  closeForm(): void {

    this.showForm = false;

    this.editingId = null;

    this.saving = false;

    this.resetForm();

  }


  // =====================================
  // SAVE
  // =====================================

  save(): void {

    if (this.saving) {

      return;

    }


    // =====================================
    // FRONTEND VALIDATION
    // =====================================

    if (!this.form.fullName.trim()) {

      this.alert.error(
        'Missing Name',
        'Participant full name is required.'
      );

      return;

    }


    if (!this.form.age ||
        this.form.age < 5 ||
        this.form.age > 100) {

      this.alert.error(
        'Invalid Age',
        'Participant age must be between 5 and 100.'
      );

      return;

    }


    if (!this.form.competitionId) {

      this.alert.error(
        'Competition Required',
        'Please select a competition.'
      );

      return;

    }


    if (!this.form.madrasaId) {

      this.alert.error(
        'Madrasa Required',
        'Please select a madrasa.'
      );

      return;

    }


    this.saving = true;


    // =====================================
    // UPDATE
    // =====================================

    if (this.editingId !== null) {

      this.participantService

        .updateParticipant(
          this.editingId,
          this.form
        )

        .subscribe({

          next: () => {

            this.saving = false;

            this.alert.success(
              'Participant Updated',
              'Participant information has been updated successfully.'
            );

            this.closeForm();

            this.loadData();

          },

          error: (error) => {

            this.saving = false;

            this.showError(error);

          }

        });

      return;

    }


    // =====================================
    // CREATE
    // =====================================

    this.participantService

      .createParticipant(this.form)

      .subscribe({

        next: () => {

          this.saving = false;

          this.alert.success(
            'Participant Registered',
            'Participant has been registered successfully.'
          );

          this.closeForm();

          this.loadData();

        },

        error: (error) => {

          this.saving = false;

          this.showError(error);

        }

      });

  }


  // =====================================
  // DELETE
  // =====================================

  deleteParticipant(
    participant: Participant
  ): void {

    const confirmed =
      window.confirm(

        `Are you sure you want to delete ${participant.fullName}?`

      );


    if (!confirmed) {

      return;

    }


    this.participantService

      .deleteParticipant(
        participant.id
      )

      .subscribe({

        next: () => {

          this.alert.success(
            'Participant Deleted',
            'Participant has been deleted successfully.'
          );

          this.loadData();

        },

        error: (error) => {

          this.showError(error);

        }

      });

  }

  // =====================================
// SCREENING - APPROVE
// =====================================

approveParticipant(participant: Participant): void {

  if (participant.status !== 'PENDING') {
    return;
  }

  this.alert.confirm(
    'Approve Participant?',
    `Are you sure you want to approve ${participant.fullName}?`
  ).then((confirmed: boolean) => {

    if (!confirmed) {
      return;
    }

    this.loading = true;

    this.participantService
      .approveParticipant(participant.id)
      .subscribe({

        next: () => {

          this.alert.success(
            'Participant Approved',
            `${participant.fullName} has been approved successfully.`
          );

          this.loadData();

        },

        error: (error) => {

          this.loading = false;

          this.showError(error);

        }

      });

  });

}


// =====================================
// SCREENING - REJECT
// =====================================

rejectParticipant(participant: Participant): void {

  if (participant.status !== 'PENDING') {
    return;
  }

  this.alert.confirm(
    'Reject Participant?',
    `Are you sure you want to reject ${participant.fullName}?`
  ).then((confirmed: boolean) => {

    if (!confirmed) {
      return;
    }

    this.loading = true;

    this.participantService
      .rejectParticipant(participant.id)
      .subscribe({

        next: () => {

          this.alert.success(
            'Participant Rejected',
            `${participant.fullName} has been rejected successfully.`
          );

          this.loadData();

        },

        error: (error) => {

          this.loading = false;

          this.showError(error);

        }

      });

  });

}

  // =====================================
  // RESET
  // =====================================

  private resetForm(): void {

    this.form = {

      fullName: '',

      gender: 'MALE',

      age: 5,

      juzuu: 'JUZUU_30',

      competitionId: 0,

      madrasaId: 0

    };

  }


  // =====================================
  // ERROR
  // =====================================

  private showError(
    error: any
  ): void {

    console.error(
      'Participant Error:',
      error
    );


    this.alert.error(

      'Operation Failed',

      error?.error?.message ??
      'Something went wrong. Please try again.'

    );

  }


  // =====================================
  // COUNTERS
  // =====================================

  get pendingCount(): number {

    return this.participants.filter(

      participant =>
        participant.status === 'PENDING'

    ).length;

  }


  get approvedCount(): number {

    return this.participants.filter(

      participant =>
        participant.status === 'APPROVED'

    ).length;

  }


  get rejectedCount(): number {

    return this.participants.filter(

      participant =>
        participant.status === 'REJECTED'

    ).length;

  }

}