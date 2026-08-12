import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  success(
    title: string,
    text?: string
  ): void {

    Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#0B4F4A'
    });

  }


  error(
    title: string,
    text?: string
  ): void {

    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#0B4F4A'
    });

  }


  warning(
    title: string,
    text?: string
  ): void {

    Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#D4A437'
    });

  }


  info(
    title: string,
    text?: string
  ): void {

    Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#0B4F4A'
    });

  }


  loading(
    title = 'Please wait...'
  ): void {

    Swal.fire({
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {

        Swal.showLoading();

      }
    });

  }


  close(): void {

    Swal.close();

  }

  confirm(title: string, text?: string, confirmText = 'Yes'): Promise<boolean> {
return Swal.fire({
icon: 'question',
title,
text,
showCancelButton: true,
confirmButtonText: confirmText,
cancelButtonText: 'Cancel'
}).then(result => result.isConfirmed);
}

}