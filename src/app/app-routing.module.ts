import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashbarComponent } from './dashbar/dashbar.component';
import { ProfileComponent } from './profile/profile.component';
import { EngineComponent } from './engine/engine.component';
import { HistoryComponent } from './history/history.component';
import 'webrtc-adapter';

const routes: Routes = [
  {
    path : '',
    component : HomeComponent
  },
  {
    path : 'login',
    component : LoginComponent
  },
  {
    path : 'register',
    component : RegisterComponent
  },
  {
    path : 'dashboard',
    component : DashboardComponent,
    children : [
      {
        path : '',
        component : ProfileComponent
      },
      {
        path : 'engine',
        component : EngineComponent
      },
      {
        path : 'history',
        component : HistoryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
