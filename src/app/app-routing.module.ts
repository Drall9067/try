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
    component : HomeComponent,
    data : {
      animation : 'HomePage'
    }
  },
  {
    path : 'login',
    component : LoginComponent,
    data : {
      animation : 'LoginPage'
    }
  },
  {
    path : 'register',
    component : RegisterComponent,
    data : {
      animation : 'RegisterPage'
    }
  },
  {
    path : 'dashboard',
    component : DashboardComponent,
    children : [
      {
        path : '',
        component : ProfileComponent,
        data : {
          animation : 'ProfilePage'
        }
      },
      {
        path : 'engine',
        component : EngineComponent,
        data : {
          animation : 'EnginePage'
        }
      },
      {
        path : 'history',
        component : HistoryComponent,
        data : {
          animation : 'HistoryPage'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
