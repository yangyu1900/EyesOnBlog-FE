import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardService } from 'src/app/service/guard.service';
import { AntiGuardService } from 'src/app/service/anti-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'page/stats',
    pathMatch: 'full'
  },
  {
    path: 'page/review',
    canActivate: [GuardService],
    loadChildren: () => import('./page/review/review.module').then(m => m.ReviewPageModule)
  },
  {
    path: 'page/wiki/join',
    loadChildren: () => import('./page/wiki/join/join.module').then(m => m.JoinPageModule)
  },
  {
    path: 'page/wiki/post',
    loadChildren: () => import('./page/wiki/post/post.module').then(m => m.PostPageModule)
  },
  {
    path: 'page/wiki/review',
    loadChildren: () => import('./page/wiki/review/review.module').then(m => m.ReviewPageModule)
  },
  {
    path: 'page/register',
    canActivate: [AntiGuardService],
    loadChildren: () => import('./page/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'page/analytics/team/year',
    //canActivate: [GuardService],
    loadChildren: () => import('./page/analytics/team/year/year.module').then(m => m.YearPageModule)
  },
  {
    path: 'page/analytics/team/month',
    //canActivate: [GuardService],
    loadChildren: () => import('./page/analytics/team/month/month.module').then(m => m.MonthPageModule)
  },
  {
    path: 'page/analytics/me/year',
    canActivate: [GuardService],
    loadChildren: () => import('./page/analytics/me/year/year.module').then(m => m.YearPageModule)
  },
  {
    path: 'page/analytics/me/month',
    canActivate: [GuardService],
    loadChildren: () => import('./page/analytics/me/month/month.module').then(m => m.MonthPageModule)
  },
  {
    path: 'page/stats',
    loadChildren: () => import('./page/stats/stats.module').then(m => m.StatsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
