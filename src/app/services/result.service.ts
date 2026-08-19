import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResultUpdateRequest {

  totalScore: number;

  rank: number;

} 

// =========================================================
// JUDGE TYPE
// =========================================================

export type JudgeType =
  | 'MEMORIZATION'
  | 'TAJWEED'
  | 'MAKHARIJ'
  | 'CHIEF';


// =========================================================
// JUZUU
// =========================================================

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


// =========================================================
// SCORE
// =========================================================

export interface Score {

  id: number;

  participantId: number;

  participant: string;

  madrasa: string;

  competition: string;

  competitionId: number;

  juzuu: Juzuu;

  judge: string;

  judgeType: JudgeType;

  score: number;

}


// =========================================================
// RESULT
// =========================================================

export interface Result {

  resultId: number;

  participantId: number;

  participant: string;

  madrasa: string;

  competition: string;

  competitionId: number;

  juzuu: Juzuu;

  totalScore: number;

  rank: number;

}


// =========================================================
// RESULT SERVICE
// =========================================================
export interface ScoreRequest {

  participantId: number;

  score: number;

}
@Injectable({
  providedIn: 'root'
})
export class ResultService {

  private readonly scoresUrl =
    'http://localhost:8282/api/scores';

  private readonly resultsUrl =
    'http://localhost:8282/api/results';


  constructor(
    private http: HttpClient
  ) {}


  // =========================================================
  // SCORE ENDPOINTS
  // =========================================================

  /**
   * Get all scores.
   *
   * Association + Chief Judge
   */
  getAllScores(): Observable<Score[]> {

    return this.http.get<Score[]>(
      this.scoresUrl
    );

  }


  /**
   * Get scores belonging to one participant.
   *
   * Association + Chief Judge + Judge
   */
  getParticipantScores(
    participantId: number
  ): Observable<Score[]> {

    return this.http.get<Score[]>(
      `${this.scoresUrl}/participant/${participantId}`
    );

  }

  // =========================================================
// JUDGE - SUBMIT SCORE
// =========================================================

createScore(
  request: ScoreRequest
): Observable<Score> {

  return this.http.post<Score>(
    this.scoresUrl,
    request
  );

}


  // =========================================================
  // RESULT ENDPOINTS
  // =========================================================

  /**
   * Generate results for a competition and Juzuu.
   *
   * Chief Judge only.
   */
  generateCompetitionResults(
    competitionId: number,
    juzuu: Juzuu
  ): Observable<Result[]> {

    return this.http.post<Result[]>(
      `${this.resultsUrl}/competition/${competitionId}/juzuu/${juzuu}/generate`,
      {}
    );

  }


  /**
   * Get already generated/saved results.
   *
   * Association + Chief Judge
   */
  getCompetitionResults(
    competitionId: number,
    juzuu: Juzuu
  ): Observable<Result[]> {

    return this.http.get<Result[]>(
      `${this.resultsUrl}/competition/${competitionId}/juzuu/${juzuu}`
    );

  }

  // =========================================================
// UPDATE RESULT
// =========================================================

/**
 * Chief Judge can correct an accidentally
 * entered result.
 */
updateResult(
  resultId: number,
  request: ResultUpdateRequest
): Observable<Result> {

  return this.http.put<Result>(
    `${this.resultsUrl}/${resultId}`,
    request
  );

}

}