import { Injectable, Inject } from '@angular/core';
import { BROWSER_STORAGE } from '../fclass/storage';
import { FaccountDataService } from './faccount-data.service';
import { User } from '../fclass/user';
import { Authresponse } from '../fclass/authresponse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private dataService: FaccountDataService
  ) { }
  public getName(): string | null {
    return this.storage.getItem('faccount-name');
  }
  public getMail(): string  | null {
    return this.storage.getItem('faccount-email');
  }

  public getToken(): string  | null {
    return this.storage.getItem('faccount-token');
  }
  public saveToken(token: string): void {
    this.storage.setItem('faccount-token', token);
  }
  public login(user: User) {
    return this.dataService.login(user);
  }
  public register(user: User) {
    return this.dataService.register(user)
    
  }

  public logout(): void {
    this.storage.removeItem('faccount-token');
  }

  public isLoggedIn(): boolean {
    //console.log('Martin in isLogin')
    const token: string  | null = this.getToken();
    //console.log(token);
    if(token === 'null' || token === 'undefined'){
      //console.log('Martin in undefined')
      return false;
    } else if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  public getCurrentUser(): any {
    if (this.isLoggedIn()) {
      const token: string | null = this.getToken();
      const { email, name } = JSON.parse(atob(token!.split('.')[1]));
      // console.log(token);
      return { email, name } as User;
    }
  }

 public isUser(name: any):any{
  return this.dataService.checkAccount(name);
 }


}
