import { Routes } from '@angular/router';

import { Home } from './public/home/home';
import { Login } from './auth/login/login';

import { Layout } from './association/layout/layout';
import { Dashboard } from './association/dashboard/dashboard';
import { Madrasas } from './association/madrasas/madrasas';
import { Judges } from './association/judges/judges';
import { Participants } from './association/participants/participants';
import { Competitions } from './association/competitions/competitions';
import { Results } from './association/results/results';

import { ChiefLayout } from './chief/chief-layout/chief-layout';
import { ChiefDaashboard } from './chief/chief-daashboard/chief-daashboard';
import { ChiefParticipants } from './chief/chief-participants/chief-participants';
import { ChiefProfile } from './chief/chief-profile/chief-profile';
import { ChiefResults } from './chief/chief-results/chief-results';
import { ChiefScores } from './chief/chief-scores/chief-scores';

import { JudgeLayout } from './judge/judge-layout/judge-layout';
import { JudgeDashboard } from './judge/judge-dashboard/judge-dashboard';
import { MyScore } from './judge/my-score/my-score';
import { JudgeCompetitions } from './judge/judge-competitions/judge-competitions';
import { JudgeParticipants } from './judge/judge-participants/judge-participants';
import { JudgeProfile } from './judge/judge-profile/judge-profile';

import { MadrasaLayout } from './madrasa/madrasa-layout/madrasa-layout';
import { MadrasaDashboard } from './madrasa/madrasa-dashboard/madrasa-dashboard';

import { roleGuard } from './guards/role.guard';
import { MadrasaCompetitions } from './madrasa/madrasa-competitions/madrasa-competitions';
import { MadrasaParticipants } from './madrasa/madrasa-participants/madrasa-participants';
import { MadrasaResults } from './madrasa/madrasa-results/madrasa-results';


export const routes: Routes = [

  // =====================================================
  // PUBLIC
  // =====================================================

  {
    path: '',
    component: Home
  },

  {
    path: 'login',
    component: Login
  },


  // =====================================================
  // ASSOCIATION
  // =====================================================

  {
    path: 'association',

    component: Layout,

    canActivate: [
      roleGuard
    ],

    data: {
      roles: [
        'ROLE_ASSOCIATION'
      ]
    },

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'madrasa',
        component: Madrasas
      },

      {
        path: 'judges',
        component: Judges
      },

      {
        path: 'participants',
        component: Participants
      },

      {
        path: 'competitions',
        component: Competitions
      },

      {
        path: 'results',
        component: Results
      }

    ]

  },


  // =====================================================
  // CHIEF JUDGE
  // =====================================================

  {
    path: 'chief',

    component: ChiefLayout,

    canActivate: [
      roleGuard
    ],

    data: {
      roles: [
        'ROLE_CHIEF_JUDGE'
      ]
    },

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: ChiefDaashboard
      },

      {
        path: 'profile',
        component: ChiefProfile
      },

      {
        path: 'participants',
        component: ChiefParticipants
      },

      {
        path: 'results',
        component: ChiefResults
      },

      {
        path: 'scores',
        component: ChiefScores
      }

    ]

  },


  // =====================================================
  // JUDGE
  // =====================================================

  {
    path: 'judge',

    component: JudgeLayout,

    canActivate: [
      roleGuard
    ],

    data: {
      roles: [
        'ROLE_JUDGE'
      ]
    },

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: JudgeDashboard
      },

      {
        path: 'scores',
        component: MyScore
      },

      {
        path: 'competition',
        component: JudgeCompetitions
      },

      {
        path: 'participants',
        component: JudgeParticipants
      },

      {
        path: 'profile',
        component: JudgeProfile
      }

    ]

  },


  // =====================================================
  // MADRASA
  // =====================================================

  {
    path: 'madrasa',

    component: MadrasaLayout,

    canActivate: [
      roleGuard
    ],

    data: {
      roles: [
        'ROLE_MADRASA'
      ]
    },

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: MadrasaDashboard
      },
      {path:'competitions',component:MadrasaCompetitions},
      {path:'participants',component:MadrasaParticipants},
      {path:'results',component:MadrasaResults}

    ]

  },


  // =====================================================
  // FALLBACK
  // =====================================================

  {
    path: '**',
    redirectTo: ''
  }

];