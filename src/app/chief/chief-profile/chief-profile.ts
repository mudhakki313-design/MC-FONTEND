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
  UserService,
  UserProfile
} from '../../services/user.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({

  selector: 'app-chief-profile',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './chief-profile.html',

  styleUrl: './chief-profile.css'

})
export class ChiefProfile implements OnInit {


  // ==========================================
  // PROFILE
  // ==========================================

  profile: UserProfile | null = null;


  // ==========================================
  // STATE
  // ==========================================

  loading = false;

  saving = false;

  editMode = false;

  imagePreview: string | null = null;

  selectedImage: File | null = null;


  // ==========================================
  // FORM
  // ==========================================

  editFullName = '';

  editEmail = '';


  constructor(

    private userService: UserService,

    private alertService: AlertService,

    private cdr: ChangeDetectorRef

  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadProfile();

  }


  // ==========================================
  // LOAD PROFILE
  // ==========================================

  loadProfile(): void {

    this.loading = true;

    this.userService
      .getMyProfile()
      .subscribe({

        next: profile => {

          this.profile = profile;

          this.editFullName =
            profile.fullName;

          this.editEmail =
            profile.email;

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Failed to load Chief Judge profile:',
            error
          );

          this.loading = false;

          this.alertService.error(
            'Unable to Load Profile',
            'Your profile information could not be loaded.'
          );

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // PROFILE IMAGE
  // ==========================================

  get profileImageUrl(): string | null {

    if (this.imagePreview) {

      return this.imagePreview;

    }


    if (this.profile?.profileImage) {

      return this.profile.profileImage;

    }


    return null;

  }


  // ==========================================
  // CREATED DATE
  // ==========================================

  get formattedCreatedAt(): string {

    if (!this.profile?.createdAt) {

      return '—';

    }


    return new Date(
      this.profile.createdAt
    ).toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  // ==========================================
  // ROLE LABEL
  // ==========================================

  get roleLabel(): string {

    if (!this.profile?.role) {

      return 'Chief Judge';

    }


    switch (this.profile.role) {

      case 'ROLE_CHIEF_JUDGE':
      case 'CHIEF_JUDGE':
        return 'Chief Judge';

      case 'ROLE_CHIEF':
      case 'CHIEF':
        return 'Chief Judge';

      default:
        return this.profile.role
          .replace('ROLE_', '')
          .replaceAll('_', ' ');

    }

  }


  // ==========================================
  // STATUS LABEL
  // ==========================================

  get statusLabel(): string {

    if (!this.profile?.status) {

      return '—';

    }


    return this.profile.status
      .replaceAll('_', ' ');

  }


  // ==========================================
  // START EDIT
  // ==========================================

  startEdit(): void {

    if (!this.profile) {

      return;

    }


    this.editFullName =
      this.profile.fullName;

    this.editEmail =
      this.profile.email;

    this.editMode = true;

  }


  // ==========================================
  // CANCEL EDIT
  // ==========================================

  cancelEdit(): void {

    if (this.profile) {

      this.editFullName =
        this.profile.fullName;

      this.editEmail =
        this.profile.email;

    }


    this.imagePreview = null;

    this.selectedImage = null;

    this.editMode = false;

  }


  // ==========================================
  // IMAGE SELECTED
  // ==========================================

  onImageSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }


    const file =
      input.files[0];


    if (!file.type.startsWith('image/')) {

      this.alertService.warning(
        'Invalid Image',
        'Please select a valid image file.'
      );

      return;

    }


    const maxSize =
      5 * 1024 * 1024;


    if (file.size > maxSize) {

      this.alertService.warning(
        'Image Too Large',
        'Profile image must not exceed 5MB.'
      );

      return;

    }


    this.selectedImage =
      file;


    const reader =
      new FileReader();


    reader.onload = () => {

      this.imagePreview =
        reader.result as string;

      this.editMode = true;

      this.cdr.detectChanges();

    };


    reader.readAsDataURL(file);

  }


  // ==========================================
  // SAVE PROFILE
  // ==========================================

  saveProfile(): void {

    if (!this.profile) {

      return;

    }


    const fullName =
      this.editFullName.trim();

    const email =
      this.editEmail.trim();


    if (!fullName) {

      this.alertService.warning(
        'Full Name Required',
        'Please enter your full name.'
      );

      return;

    }


    if (!email) {

      this.alertService.warning(
        'Email Required',
        'Please enter your email address.'
      );

      return;

    }


    this.saving = true;


    // ========================================
    // STEP 1: UPDATE DETAILS
    // ========================================

    this.userService
      .updateMyProfile({

        fullName,

        email

      })
      .subscribe({

        next: updatedProfile => {

          this.profile =
            updatedProfile;


          // ==================================
          // STEP 2: UPLOAD IMAGE
          // ==================================

          if (this.selectedImage) {

            this.userService
              .uploadProfileImage(
                this.selectedImage
              )
              .subscribe({

                next: imageProfile => {

                  this.profile =
                    imageProfile;

                  this.finishSave();

                },

                error: error => {

                  console.error(
                    'Profile image upload failed:',
                    error
                  );

                  this.saving = false;

                  this.alertService.error(
                    'Image Upload Failed',
                    'Your profile details were saved, but the image could not be uploaded.'
                  );

                  this.cdr.detectChanges();

                }

              });

          } else {

            this.finishSave();

          }

        },

        error: error => {

          console.error(
            'Failed to update Chief Judge profile:',
            error
          );

          this.saving = false;

          this.alertService.error(
            'Update Failed',
            'Your profile could not be updated.'
          );

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // FINISH SAVE
  // ==========================================

  private finishSave(): void {

    this.saving = false;

    this.editMode = false;

    this.imagePreview = null;

    this.selectedImage = null;


    this.alertService.success(
      'Profile Updated',
      'Your Chief Judge profile has been updated successfully.'
    );


    this.cdr.detectChanges();

  }

}