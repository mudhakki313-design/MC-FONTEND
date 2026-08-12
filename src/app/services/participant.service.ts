import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Gender = 'MALE' | 'FEMALE';

export type Juzuu =
  | 'JUZUU_1'
  | 'JUZUU_2'
  | 'JUZUU_3'
  | 'JUZUU_4'
  | 'JUZUU_5'
  | 'JUZUU_6'
  | 'JUZUU_7'
  | 'JUZUU_8'
  | 'JUZUU_9'
  | 'JUZUU_10'
  | 'JUZUU_11'
  | 'JUZUU_12'
  | 'JUZUU_13'
  | 'JUZUU_14'
  | 'JUZUU_15'
  | 'JUZUU_16'
  | 'JUZUU_17'
  | 'JUZUU_18'
  | 'JUZUU_19'
  | 'JUZUU_20'
  | 'JUZUU_21'
  | 'JUZUU_22'
  | 'JUZUU_23'
  | 'JUZUU_24'
  | 'JUZUU_25'
  | 'JUZUU_26'
  | 'JUZUU_27'
  | 'JUZUU_28'
  | 'JUZUU_29'
  | 'JUZUU_30';

export type ParticipantStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED';


export interface Participant {

  id: number;

  fullName: string;

  gender: Gender;

  age: number;

  juzuu: Juzuu;

  status: ParticipantStatus;

  madrasa: string;

  competition: string;

}


export interface ParticipantRequest {

  fullName: string;

  gender: Gender;

  age: number;

  juzuu: Juzuu;

  competitionId: number;

  madrasaId: number;

}


@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private readonly apiUrl ='http://localhost:8282/api/participants';
private screeningUrl = 'http://localhost:8282/api/screening';

  constructor(
    private http: HttpClient
  ) {}


  getAllParticipants(): Observable<Participant[]> {

    return this.http.get<Participant[]>(
      this.apiUrl
    );

  }


  getParticipantById(
    id: number
  ): Observable<Participant> {

    return this.http.get<Participant>(
      `${this.apiUrl}/${id}`
    );

  }


  createParticipant(
    request: ParticipantRequest
  ): Observable<Participant> {

    return this.http.post<Participant>(
      this.apiUrl,
      request
    );

  }


  updateParticipant(
    id: number,
    request: ParticipantRequest
  ): Observable<Participant> {

    return this.http.put<Participant>(
      `${this.apiUrl}/${id}`,
      request
    );

  }


  deleteParticipant(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

  approveParticipant(id: number) {

  return this.http.patch<Participant>(
    `${this.screeningUrl}/${id}/approve`,
    {}
  );

}

rejectParticipant(id: number) {

  return this.http.patch<Participant>(
    `${this.screeningUrl}/${id}/reject`,
    {}
  );

}

}