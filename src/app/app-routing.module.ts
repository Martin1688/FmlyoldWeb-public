import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackupdbComponent } from './backupdb/backupdb.component';
import { ButgetComponent } from './butget/butget.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { MonthlistComponent } from './monthlist/monthlist.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'monthlist',
    component: MonthlistComponent
  },
  {
    path: 'monthbudget',
    component: ButgetComponent
  },
  {
    path: 'backupdb',
    component: BackupdbComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
