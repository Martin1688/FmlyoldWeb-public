import { Component, OnInit } from '@angular/core';
import { Cunsume } from '../fclass/cunsume';
import { User } from '../fclass/user';
import { AuthenticationService } from '../fservice/authentication.service';
import { FaccountDataService } from '../fservice/faccount-data.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  public newConsume: Cunsume = {
    _id: '',
    cyear: '',
    cmonth: '',
    cday: '',
    itemName: '',
    price: '',
    memo: '',
    buyer: ''
  };
  // newConsume= new FormGroup( {
  //   cdate: new FormControl(''),
  //   itemName: new FormControl(''),
  //   price: new FormControl(''),
  //   memo: new FormControl('')
  // });
  public formVisible: boolean = false;
  public formError: string='';
  public btnLocked=false;
  constructor(private authenticationService: AuthenticationService,
    private dataService: FaccountDataService) { }

  ngOnInit() {
    this.formClear();
  }
  public isLoggedIn(): boolean {
    this.getUsername();
    return this.authenticationService.isLoggedIn();
  }
  public getUsername(): string {
    const user: User = this.authenticationService.getCurrentUser();
    if (user && user.name) {
      this.newConsume.buyer = user.name;
    }
    return user ? user.name : 'Guest';
  }

  public onConsumeSubmit(): void {
    let errMsg = '';
    if (this.newConsume.itemName === '') {
      errMsg += "名稱未填;"
    }
    if (this.newConsume.price === '') {
      errMsg += "價錢未填;"
    }
    if (this.newConsume.cyear === '') {
      errMsg += "買年未填;"
    }
    if (this.newConsume.cmonth === '') {
      errMsg += "買月未填;"
    }
    if (this.newConsume.cday === '') {
      errMsg += "買日未填;"
    }
    if (errMsg !== '') {
      this.formError = errMsg;
      return;
    }
    this.btnLocked=true;
    this.dataService.newAccount(this.newConsume)
    .subscribe((response) => {
      this.btnLocked=false;
      const {message} = response as {message:any,data:any};
         console.log(message);
        if (message == 'Created') {
          this.formError = '新增成功';
          this.formClear();
        } else {
          this.formError = message;
        }
      }
      
      );
  }
  public formClear(): void {
    const nowDate: String = new String(new Date().toLocaleString());
    const dateAry = nowDate.substr(0, nowDate.indexOf(' ')).split('/');
    // nowDate.substr(0,nowDate.indexOf(' '));

    //console.log(nowDate.substr(0,nowDate.indexOf(' ')).split('/'));
    this.newConsume = {
      _id:'',
      cyear: dateAry[0],
      cmonth: dateAry[1],
      cday: dateAry[2],
      itemName: '',
      price: '',
      memo: '',
      buyer: this.getUsername()
    };
    //console.log(this.newConsume);
  }

  public hidedError() {
    this.formError = '';
  }


}
