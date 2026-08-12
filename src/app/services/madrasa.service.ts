import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Madrasa {
  id: number;
  name: string;
  registrationNumber: string;
  district: string;
  region: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  username: string;
  createdAt: string;
}

export interface MadrasaRequest {
  name: string;
  registrationNumber: string;
  district: string;
  region: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class MadrasaService {

  private readonly API_URL =
    'http://localhost:8282/api/madrasas';

  constructor(
    private http: HttpClient
  ) {}


  // =====================================
  // GET ALL
  // =====================================

  getAllMadrasas(): Observable<Madrasa[]> {

    return this.http.get<Madrasa[]>(
      this.API_URL
    );

  }


  // =====================================
  // GET ONE
  // =====================================

  getMadrasa(
    id: number
  ): Observable<Madrasa> {

    return this.http.get<Madrasa>(
      `${this.API_URL}/${id}`
    );

  }


  // =====================================
  // CREATE
  // =====================================

  createMadrasa(
    request: MadrasaRequest
  ): Observable<Madrasa> {

    return this.http.post<Madrasa>(
      this.API_URL,
      request
    );

  }


  // =====================================
  // UPDATE
  // =====================================

  updateMadrasa(
    id: number,
    request: MadrasaRequest
  ): Observable<Madrasa> {

    return this.http.put<Madrasa>(
      `${this.API_URL}/${id}`,
      request
    );

  }


  // =====================================
  // DEACTIVATE
  // =====================================

  deactivateMadrasa(
    id: number
  ): Observable<void> {

    return this.http.patch<void>(
      `${this.API_URL}/${id}/deactivate`,
      {}
    );

  }

}