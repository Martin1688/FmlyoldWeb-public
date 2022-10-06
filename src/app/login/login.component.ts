import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authresponse } from '../fclass/authresponse';
import { BROWSER_STORAGE } from '../fclass/storage';
import { AuthenticationService } from '../fservice/authentication.service';
import { HistoryService } from '../fservice/history.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public formError: string = '';
  public credentials = {
    name: '',
    email: '',
    password: '',
    keep: true
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private historyService: HistoryService,
    @Inject(BROWSER_STORAGE) private storage: Storage) { }

  ngOnInit() {
    const temail=this.authenticationService.getMail();
    const tname=this.authenticationService.getName();
    this.credentials.email = temail === null ?'':temail!;
    this.credentials.name = tname === null ? '' : tname;
  }
  public onLoginSubmit(): void {
    // console.log(this.credentials);

    this.formError = '';
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = '全部欄位都必填';
    } else {
      this.doLogin();
    }
  }
  private doLogin(): void {
    this.credentials.name = this.captalCase(this.credentials.name);
    this.authenticationService.login(this.credentials)
    .subscribe((Response) => {
      const authResp = Response as Authresponse;
        if(this.credentials.keep){
          this.storage.setItem('faccount-name', this.credentials.name);
          this.storage.setItem('faccount-email', this.credentials.email);
          } else{
            this.storage.setItem('faccount-name', '');
            this.storage.setItem('faccount-email', '');
  
          }
        this.authenticationService.saveToken(authResp.token);
        this.router.navigate(['']);      
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
