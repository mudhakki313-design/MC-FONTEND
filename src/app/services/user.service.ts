import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {

  id: number;

  fullName: string;

  username: string;

  email: string;

  role: string;

  status: string;

  profileImage: string | null;

  createdAt: string;

}

export interface UserProfileUpdateRequest {

  fullName: string;

  email: string;

}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_URL =
    'http://localhost:8282/api';

  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // MY PROFILE
  // ==========================================

  getMyProfile(): Observable<UserProfile> {

    return this.http.get<UserProfile>(
      `${this.API_URL}/profile`
    );

  }


  // ==========================================
  // UPDATE MY PROFILE
  // ==========================================

  updateMyProfile(
    request: UserProfileUpdateRequest
  ): Observable<UserProfile> {

    return this.http.put<UserProfile>(
      `${this.API_URL}/profile`,
      request
    );

  }


  // ==========================================
  // UPLOAD PROFILE IMAGE
  // ==========================================

  uploadProfileImage(
    file: File
  ): Observable<UserProfile> {

    const formData =
      new FormData();

    formData.append(
      'file',
      file
    );

    return this.http.post<UserProfile>(
      `${this.API_URL}/profile/image`,
      formData
    );

  }

  updateProfile(
  profileImage: string
): Observable<UserProfile> {

  return this.http.put<UserProfile>(
    `${this.API_URL}/profile`,
    {
      profileImage
    }
  );

}

}