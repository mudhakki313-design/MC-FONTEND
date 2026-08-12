import { Routes } from '@angular/router';

import { Home } from './public/home/home';
import { Login } from './auth/login/login';

import { Layout } from './association/layout/layout';
import { Dashboard } from './association/dashboard/dashboard';
import { Madrasas } from './association/madrasas/madrasas';

import { ChiefLayout } from './chief/chief-layout/chief-layout';

import { JudgeLayout } from './judge/judge-layout/judge-layout';
import { JudgeDashboard } from './judge/judge-dashboard/judge-dashboard';
import { Judges } from './association/judges/judges';
import { Participants } from './association/participants/participants';
import { Competitions } from './association/competitions/competitions';


export const routes: Routes = [
  // PUBLIC
   {path: '',component: Home},
   {path: 'login',component: Login},
  // ASSOCIATION
  {
    path: 'association',component: Layout,
    children: [
      {path: '',redirectTo: 'dashboard',pathMatch: 'full'},
      {path: 'dashboard',component: Dashboard},
      {path: 'madrasa',component: Madrasas},
      {path: 'judges',component:Judges},
      {path: 'participants',component: Participants},
      {path: 'competitions',component: Competitions}
    ]

  },


  // CHIEF JUDGE

  {
    path: 'chief',
    component: ChiefLayout,

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

      // Tutakuja kuongeza Chief Dashboard hapa
    ]

  },


  // JUDGE

  {
    path: 'judge',
    component: JudgeLayout,

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: JudgeDashboard
      }

    ]

  },


  // FALLBACK

  {
    path: '**',
    redirectTo: ''
  }

];