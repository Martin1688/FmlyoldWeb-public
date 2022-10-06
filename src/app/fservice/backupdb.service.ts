import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BROWSER_STORAGE } from '../fclass/storage';

@Injectable({
  providedIn: 'root'
})
export class BackupdbService {
  private apiBaseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage) {

   }

   public getAllDB(info: {email:string, name:string}) {
    //console.log(this.apiBaseUrl);
    const url: string = `${this.apiBaseUrl}/readdb`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };

    return this.http
      .post(url, info,httpOptions);
  } 
  
  public putAllDB(obj:any){
    const url: string = `${this.apiBaseUrl}/restoreddb`;
    //console.log(obj);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };

    return this.http
      .post(url, obj,httpOptions);

  }
}
