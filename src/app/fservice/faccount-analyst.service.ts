import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BROWSER_STORAGE } from '../fclass/storage';
import { Para } from '../fclass/para';

@Injectable({
  providedIn: 'root'
})
export class FaccountAnalystService {

  private apiBaseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage) {
  }

  private handleError(error: any): Promise<any> {
    console.log(error.status);
    if (error.status == 401) {
      return Promise.reject('帳號不存在，請先註冊');
    } else if (error.status == 402) {
      return Promise.reject('帳號或密碼不正確');
    }
    return Promise.reject(error.message || error);
  }

  public readMonthItems(paras: any) {
    //console.log(this.apiBaseUrl);
    const url: string = `${this.apiBaseUrl}/fmaccount`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };

    return this.http
      .patch(url, paras,httpOptions);
  }

  public getParasByName(model:Para){
    const url: string = `${this.apiBaseUrl}/paras`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };
    return this.http
      .patch(url, model,httpOptions); 
  }
  
  public setParasByName(model:Para){
    const url: string = `${this.apiBaseUrl}/paras`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };
    return this.http
      .post(url, model,httpOptions); 
  }

  public delById(_id:string){
    const url: string = `${this.apiBaseUrl}/paras/${_id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };
    return this.http
      .delete(url,httpOptions);    
  }
}
