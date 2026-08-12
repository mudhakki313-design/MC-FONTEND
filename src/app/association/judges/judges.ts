import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Judge,
  JudgeRequest,
  JudgeService
} from '../../services/judge.service';

import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-judges',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './judges.html',

  styleUrl: './judges.css'
})
export class Judges implements OnInit {


  // =====================================
  // DATA
  // =====================================

  judges: Judge[] = [];

  filteredJudges: Judge[] = [];


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
  // SEARCH
  // =====================================

  searchTerm = '';

  selectedType = 'ALL';


  // =====================================
  // FORM
  // =====================================

  form: JudgeRequest = {

    judgeNumber: '',

    fullName: '',

    phone: '',

    email: '',

    judgeType: 'MEMORIZATION',

    status: 'ACTIVE'

  };


  constructor(

    private judgeService: JudgeService,

    private alert: AlertService,

    private cdr: ChangeDetectorRef

  ) {}


  // =====================================
  // INIT
  // =====================================

  ngOnInit(): void {

    this.loadJudges();

  }


  // =====================================
  // LOAD
  // =====================================

  loadJudges(): void {

    this.loading = true;


    this.judgeService
      .getAllJudges()
      .subscribe({

        next: (data) => {

          this.judges = data;

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
            'Unable to load judges.'

          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================
  // SEARCH + FILTER
  // =====================================

  applyFilters(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.filteredJudges =
      this.judges.filter(judge => {


        const matchesSearch =

          !search ||

          judge.fullName
            .toLowerCase()
            .includes(search) ||

          judge.judgeNumber
            .toLowerCase()
            .includes(search) ||

          judge.email
            .toLowerCase()
            .includes(search);


        const matchesType =

          this.selectedType === 'ALL' ||

          judge.judgeType === this.selectedType;


        return matchesSearch && matchesType;

      });

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

  openEdit(judge: Judge): void {

    this.editingId = judge.id;


    this.form = {

      judgeNumber:
        judge.judgeNumber,

      fullName:
        judge.fullName,

      phone:
        judge.phone,

      email:
        judge.email,

      judgeType:
        judge.judgeType,

      status:
        judge.status

    };


    this.showForm = true;

  }


  // =====================================
  // CLOSE
  // =====================================

  closeForm(): void {

    this.showForm = false;

    this.editingId = null;

    this.resetForm();

    this.saving = false;

  }


  // =====================================
  // SAVE
  // =====================================

  save(): void {

    if (this.saving) {

      return;

    }


    this.saving = true;


    // =====================================
    // UPDATE
    // =====================================

    if (this.editingId !== null) {

      this.judgeService

        .updateJudge(
          this.editingId,
          this.form
        )

        .subscribe({

          next: () => {

            this.saving = false;

            this.alert.success(

              'Judge Updated',

              'Judge information has been updated successfully.'

            );

            this.closeForm();

            this.loadJudges();

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

    this.judgeService

      .createJudge(this.form)

      .subscribe({

        next: () => {

          this.saving = false;

          this.alert.success(

            'Judge Registered',

            'Judge has been registered successfully.'

          );

          this.closeForm();

          this.loadJudges();

        },


        error: (error) => {

          this.saving = false;

          this.showError(error);

        }

      });

  }


  // =====================================
  // DEACTIVATE
  // =====================================

  deactivate(judge: Judge): void {

    if (judge.status === 'INACTIVE') {

      return;

    }


    const confirmed = window.confirm(

      `Are you sure you want to deactivate ${judge.fullName}?`

    );


    if (!confirmed) {

      return;

    }


    this.judgeService

      .deactivateJudge(judge.id)

      .subscribe({

        next: () => {

          this.alert.success(

            'Judge Deactivated',

            'The judge has been deactivated successfully.'

          );

          this.loadJudges();

        },


        error: (error) => {

          this.showError(error);

        }

      });

  }


  // =====================================
  // RESET
  // =====================================

  private resetForm(): void {

    this.form = {

      judgeNumber: '',

      fullName: '',

      phone: '',

      email: '',

      judgeType: 'MEMORIZATION',

      status: 'ACTIVE'

    };

  }


  // =====================================
  // ERROR
  // =====================================

  private showError(error: any): void {

    console.error(
      'Judge Operation Error:',
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

  get activeCount(): number {

    return this.judges.filter(

      judge =>
        judge.status === 'ACTIVE'

    ).length;

  }


  get inactiveCount(): number {

    return this.judges.filter(

      judge =>
        judge.status === 'INACTIVE'

    ).length;

  }


  get chiefCount(): number {

    return this.judges.filter(

      judge =>
        judge.judgeType === 'CHIEF'

    ).length;

  }


  get scoringJudgesCount(): number {

    return this.judges.filter(

      judge =>
        judge.judgeType !== 'CHIEF'

    ).length;

  }

}