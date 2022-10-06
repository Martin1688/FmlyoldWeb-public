import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authresponse } from '../fclass/authresponse';
import { AuthenticationService } from '../fservice/authentication.service';
import { HistoryService } from '../fservice/history.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public formError: string = '';
  private accountUsed = false;
  public credentials = {
    name: '',
    email: '',
    password: '',
    keep: true
  };
  // public pageContent = {
  //   header: {
  //     title: 'Create a new account',
  //     strapline: ''
  //   },
  //   sidebar: ''
  // };
  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private historyService: HistoryService
  ) { }

  ngOnInit() {
  }
  public onRegisterSubmit(): void {
    // console.log(this.credentials);
    this.formError = '';
    if (
      !this.credentials.name ||
      !this.credentials.email ||
      !this.credentials.password
    ) {
      this.formError = '全部欄位都是必填，請再試一次';
    } else {
      this.doRegister();
    }
  }
  private doRegister() {
    this.authenticationService.register(this.credentials)
    .subscribe((Response) =>
     {
      const authResp = Response as Authresponse;
      this.authenticationService.saveToken(authResp.token); 
      this.router.navigate(['']);      
      //this.router.navigateByUrl(this.historyService.getLastNonLoginUrl())
      });
  }

  checkAccount(): any {
    this.credentials.name =this.captalCase(this.credentials.name); 
    this.authenticationService.isUser(this.credentials.name)
    .subscribe((response: boolean) => {
        const ok = response as boolean;
        if (ok == true) {
          this.formError = '帳號已經有人使用';
          this.accountUsed = true;
        } else {
          this.formError = '';
          this.accountUsed = false;
        }
      });
  }

  clearErr(): void {
    this.formError = '';
    this.credentials.name = '';
  }
  public captalCase(input: string): string {
    if (!input) {
      return '';
    } else {
      return input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()));
    }
  }

}
