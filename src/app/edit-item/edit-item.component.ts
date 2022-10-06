import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Cunsume } from '../fclass/cunsume';
import { FaccountDataService } from '../fservice/faccount-data.service';
import { AuthenticationService } from '../fservice/authentication.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {
  @Input() newConsume: Cunsume | undefined;
  @Output() editResult = new EventEmitter<boolean>();
  formError='';
  constructor(private authenticationService: AuthenticationService,private dataService: FaccountDataService) { }

  ngOnInit() {
  }

  onEditSubmit() {
    let errMsg = '';
    if (this.newConsume!.itemName === '') {
      errMsg += "名稱未填;"
    }
    if (this.newConsume!.price === '') {
      errMsg += "價錢未填;"
    }
    if (this.newConsume!.cyear === '') {
      errMsg += "買年未填;"
    }
    if (this.newConsume!.cmonth === '') {
      errMsg += "買月未填;"
    }
    if (this.newConsume!.cday === '') {
      errMsg += "買日未填;"
    }
    if (errMsg !== '') {
      this.formError = errMsg;
      return;
    }
    this.dataService.editAccount(this.newConsume!)
    .subscribe((response) => {
        const {message}= response as {message:any,data:any};
        //console.log(message);
        if (message == 'Updated') {
          this.editResult.emit(true);
        } else {
          this.formError = response as string;
        }
      }); 
    
  }
  public isLoggedIn(): boolean {

    return this.authenticationService.isLoggedIn();
  }
  editCancel(){
    this.editResult.emit(false);
  }

  hidedError(){
   this.formError='';
  }
}
