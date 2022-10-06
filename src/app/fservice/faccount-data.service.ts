import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BROWSER_STORAGE } from '../fclass/storage';
import { User } from '../fclass/user';
import { Authresponse } from '../fclass/authresponse';
import { Cunsume } from '../fclass/cunsume';
import { Para } from '../fclass/para';

@Injectable({
  providedIn: 'root'
})
export class FaccountDataService {
  private apiBaseUrl = environment.apiBaseUrl;
  //private apiBaseUrl = 'https://tranquil-coast-59247.herokuapp.com/api';

  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage) {
    // console.log('martin '+this.apiBaseUrl);
  }

  private handleError(error: any): Promise<any> {
    console.log(error.status);
    if (error.status == 401) {
      return Promise.reject('帳號不存在，請先註冊');
    } else if (error.status == 402) {
      return Promise.reject('密碼不正確');
    }
    //console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

  public login(user: User) {
    return this.makeAuthApiCall('login', user);
  }
  public register(user: User) {
    return this.makeAuthApiCall('register', user);
  }
  private makeAuthApiCall(urlPath: string, user: User) {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return this.http
      .post(url, user);
  }

  public checkAccount(uname: string) {
    const url: string = `${this.apiBaseUrl}/isuser`;
    return this.http
      .post(url, { name: uname });
  }

  /// add account
  public newAccount(acnt: Cunsume) {
    const url: string = `${this.apiBaseUrl}/fmaccount`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };

    return this.http
      .post(url, acnt, httpOptions);
  }
  
  editAccount(acnt: Cunsume) {
    const url: string = `${this.apiBaseUrl}/fmaccount/${acnt._id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };

    return this.http
      .put(url, acnt, httpOptions);
  }


  delItem(_id: string) {
    const url: string = `${this.apiBaseUrl}/fmaccount/${_id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };

    return this.http
      .delete(url,httpOptions);
  }
  public getName(): string | null {

    const token: string | null = this.storage.getItem('faccount-token');
    const { email, name } = JSON.parse(atob(token!.split('.')[1]));
    // console.log(token);
  
    return name;
  }



}
