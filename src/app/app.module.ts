import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackupdbComponent } from './backupdb/backupdb.component';
import { ButgetComponent } from './butget/butget.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { FrameworkComponent } from './framework/framework.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { MonthlistComponent } from './monthlist/monthlist.component';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    FrameworkComponent,
    HomepageComponent,
    RegisterComponent,
    LoginComponent,
    MonthlistComponent,
    EditItemComponent,
    ButgetComponent,
    BackupdbComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule 
  ],
  providers: [],
  bootstrap: [FrameworkComponent]
})
export class AppModule { }
