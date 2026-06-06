import { Routes } from '@angular/router';
import { TimerComponent } from './timer/timer';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: TimerComponent, data: { page: 'home' } },
  { path: 'stopwatch', component: TimerComponent, data: { page: 'stopwatch' } },
  { path: 'countdown', component: TimerComponent, data: { page: 'countdown' } },
  { path: 'zeitgefuehl', component: TimerComponent, data: { page: 'zeitgefuehl' } },
  { path: 'reaktion', component: TimerComponent, data: { page: 'reaktion' } },
  { path: 'stopclock', component: TimerComponent, data: { page: 'stopclock' } },
  { path: 'bpm', component: TimerComponent, data: { page: 'bpm' } },
  { path: 'blindcounter', component: TimerComponent, data: { page: 'blindcounter' } },
  { path: 'sequence', component: TimerComponent, data: { page: 'sequence' } },
  { path: 'leaderboard', component: TimerComponent, data: { page: 'leaderboard' } },
  { path: 'profile', component: TimerComponent, data: { page: 'profile' } },
  { path: 'shop', component: TimerComponent, data: { page: 'shop' } },
  { path: '**', redirectTo: 'home' },
];
