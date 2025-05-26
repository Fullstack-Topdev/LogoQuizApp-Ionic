import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'award', loadChildren: () => import('./award/award.module').then(m => m.AwardPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'main-level', loadChildren: () => import('./main-level/main-level.module').then(m => m.MainLevelPageModule) },
  { path: 'sub-level', loadChildren: () => import('./sub-level/sub-level.module').then(m => m.SubLevelPageModule) },
  { path: 'quiz', loadChildren: () => import('./quiz/quiz.module').then(m => m.QuizPageModule) },
  { path: 'quiz-result', loadChildren: () => import('./quiz-result/quiz-result.module').then(m => m.QuizResultPageModule) },
  { path: 'burst-quiz', loadChildren: () => import('./burst-quiz/burst-quiz.module').then(m => m.BurstQuizPageModule) },
  { path: 'burst-quizresult', loadChildren: () => import('./burst-quizresult/burst-quizresult.module').then(m => m.BurstQuizresultPageModule) },
 
  { path: 'get-tip', loadChildren: () => import('./get-tip/get-tip.module').then(m => m.GetTipPageModule) },
  { path: 'buy-tip', loadChildren: () => import('./buy-tip/buy-tip.module').then(m => m.BuyTipPageModule) },
  { path: 'stats', loadChildren: () => import('./stats/stats.module').then(m => m.StatsPageModule) },
  { path: 'ranking', loadChildren: () => import('./ranking/ranking.module').then(m => m.RankingPageModule) },
  { path: 'setting', loadChildren: () => import('./setting/setting.module').then(m => m.SettingPageModule) },

   { path: '**', redirectTo: 'page-not-found' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
