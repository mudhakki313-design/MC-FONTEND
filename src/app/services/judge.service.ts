import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Judge {

  id: number;

  judgeNumber: string;

  fullName: string;

  phone: string;

  email: string;

  judgeType:
    | 'MEMORIZATION'
    | 'TAJWEED'
    | 'MAKHARIJ'
    | 'CHIEF';

  status:
    | 'ACTIVE'
    | 'INACTIVE';

  username: string;

  createdAt?: string;
}


export interface JudgeRequest {

  judgeNumber: string;

  fullName: string;

  phone: string;

  email: string;

  judgeType:
    | 'MEMORIZATION'
    | 'TAJWEED'
    | 'MAKHARIJ'
    | 'CHIEF';

  status:
    | 'ACTIVE'
    | 'INACTIVE';

}


@Injectable({
  providedIn: 'root'
})
export class JudgeService {

  private readonly apiUrl =
    'http://localhost:8282/api/judges';


  constructor(
    private http: HttpClient
  ) {}


  // =====================================
  // GET ALL
  // =====================================

  getAllJudges(): Observable<Judge[]> {

    return this.http.get<Judge[]>(
      this.apiUrl
    );

  }


  // =====================================
  // GET ONE
  // =====================================

  getJudgeById(
    id: number
  ): Observable<Judge> {

    return this.http.get<Judge>(
      `${this.apiUrl}/${id}`
    );

  }


  // =====================================
  // CREATE
  // =====================================

  createJudge(
    request: JudgeRequest
  ): Observable<Judge> {

    return this.http.post<Judge>(
      this.apiUrl,
      request
    );

  }


  // =====================================
  // UPDATE
  // =====================================

  updateJudge(
    id: number,
    request: JudgeRequest
  ): Observable<Judge> {

    return this.http.put<Judge>(
      `${this.apiUrl}/${id}`,
      request
    );

  }


  // =====================================
  // DEACTIVATE
  // =====================================

  deactivateJudge(
    id: number
  ): Observable<void> {

    return this.http.patch<void>(
      `${this.apiUrl}/${id}/deactivate`,
      {}
    );

  }

}