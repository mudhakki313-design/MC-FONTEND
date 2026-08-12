import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type CompetitionStatus =
  | 'UPCOMING'
  | 'ONGOING'
  | 'COMPLETED';


export interface Competition {

  id: number;

  title: string;

  venue: string;

  competitionDate: string;

  status: CompetitionStatus;

  createdAt: string;

}


export interface CompetitionRequest {

  title: string;

  venue: string;

  competitionDate: string;

  status: CompetitionStatus;

}


@Injectable({
  providedIn: 'root'
})
export class CompetitionService {

  private readonly apiUrl =
    'http://localhost:8282/api/competitions';


  constructor(
    private http: HttpClient
  ) {}


  // =====================================
  // GET ALL
  // =====================================

  getAllCompetitions():
    Observable<Competition[]> {

    return this.http.get<Competition[]>(
      this.apiUrl
    );

  }


  // =====================================
  // GET ONE
  // =====================================

  getCompetitionById(
    id: number
  ): Observable<Competition> {

    return this.http.get<Competition>(
      `${this.apiUrl}/${id}`
    );

  }


  // =====================================
  // CREATE
  // =====================================

  createCompetition(
    request: CompetitionRequest
  ): Observable<Competition> {

    return this.http.post<Competition>(
      this.apiUrl,
      request
    );

  }


  // =====================================
  // UPDATE
  // =====================================

  updateCompetition(
    id: number,
    request: CompetitionRequest
  ): Observable<Competition> {

    return this.http.put<Competition>(
      `${this.apiUrl}/${id}`,
      request
    );

  }


  // =====================================
  // DELETE
  // =====================================

  deleteCompetition(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}