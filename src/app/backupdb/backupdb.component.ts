import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../fservice/authentication.service';
import { BackupdbService } from '../fservice/backupdb.service';

@Component({
  selector: 'app-backupdb',
  templateUrl: './backupdb.component.html',
  styleUrls: ['./backupdb.component.css']
})
export class BackupdbComponent implements OnInit {
  formError = '';
  restoredOk = false;
  dbary: any[] = [];
  private setting = {
    element: {
      dynamicDownload: null as unknown as HTMLElement
    }
  }

  constructor(private db: BackupdbService, private auth: AuthenticationService) { }

  ngOnInit(): void {
  }
  dynamicDownloadTxt() {
    const user = this.auth.getCurrentUser();
    const fName = 'DbBackup' + this.getDateString() + '.db';
    this.db.getAllDB({ email: user.email, name: user.name }).subscribe(
      {
        next: (result) => {
          const { message, data } = result as { message: string, data: any };
          if (message.indexOf('success') > -1) {
            this.dyanmicDownloadByHtmlTag({
              fileName: fName,
              text: JSON.stringify(data)
            });

            //console.log(data);
          } else {
            this.formError = message;
          }
        },
        error: (err: HttpErrorResponse) => {
          const errResult = err.error as { message: string, token: string };
          this.formError = errResult.message;
        }
      });
  }

  // restoredDB() {

  // }

  dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    //const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    const fileType = 'text/json';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

  getDateString() {
    let ret = '';
    const theDate = new Date();
    const nowDate: String = new String(new Date().toLocaleString());
    const ary = nowDate.split(' ');
    const dateAry = ary[0].split('/');
    ret += dateAry[0];
    ret += dateAry[1].length > 1 ? dateAry[1] : '0' + dateAry[1];
    ret += dateAry[2].length > 1 ? dateAry[2] : '0' + dateAry[2];
    let timeAry = [];
    let timeStr = ary[1];
    if (timeStr.indexOf('下午') > -1) {
      timeStr = timeStr.replace('下午', '');
      timeAry = timeStr.split(':');
      ret += this.format2digit(timeAry[0], true);
      ret += this.format2digit(timeAry[1], false);
      ret += this.format2digit(timeAry[2], false);
    } else {
      timeStr = timeStr.replace('上午', '');
      timeAry = timeStr.split(':');
      ret += this.format2digit(timeAry[0], false);
      ret += this.format2digit(timeAry[1], false);
      ret += this.format2digit(timeAry[2], false);
    }
    //console.log(dateAry);
    return ret;
  }
  format2digit(str: string, pm: boolean) {
    let ret = str;
    if (pm) {
      const num = 12 + parseInt(str);
      ret = num.toString();
    } else {
      ret = str.length > 1 ? str : '0' + str;
    }
    return ret;
  }

  //In your component:
  uploadFile(event: { target: any }) {
    this.formError = '';
    if (event.target.files.length !== 1) {
      console.error('No file selected');
    } else {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const dbText = reader.result!.toString();
        const { users, paras, fmaccount } = JSON.parse(dbText);//  as {users:any,paras:any,fmaccount:any}
        //console.log(dbText);
        // this.db.putAllDB({ary:users,coname:'users'}).subscribe({
        //   next: (result) => {
        //     const { message, data } = result as { message: string, data: any };
        //     if (message.indexOf('success') > -1){
        //       this.formError +='users資料庫備份成功;';
        //     } else {
        //       this.formError +='users資料庫備份失敗;';
        //     }
        //   },
        //   error: (err: HttpErrorResponse) => {
        //     const errResult = err.error as { message: string, data: any };
        //     this.formError +='users資料庫備份失敗;'+ errResult.message;
        //   }          
        // });
        // this.db.putAllDB({ary:paras,coname:'paras'}).subscribe({
        //   next: (result) => {
        //     const { message, data } = result as { message: string, data: any };
        //     if (message.indexOf('success') > -1){
        //       this.formError +='paras資料庫備份成功;';
        //     } else {
        //       this.formError +='paras資料庫備份失敗;';
        //     }
        //   },
        //   error: (err: HttpErrorResponse) => {
        //     const errResult = err.error as { message: string, data: any };
        //     this.formError +='paras資料庫備份失敗;'+ errResult.message;
        //   }          
        // });
        const uary = users as any[];
        this.restoredPartCollection(uary, 'users');
        // const pary = paras as any[];
        // this.restoredPartCollection(pary, 'paras');
        // const fary = fmaccount as any[];
        // this.restoredPartCollection(fary, 'fmaccount');
      };
      reader.readAsText(event.target.files[0]);
    }
  }
  restoredPartCollection(ary: any[], coName: string) {
    //const origin = this.dbary;
    let idx = 0;
    while (idx < ary.length) {
      if (idx <ary.length) {
        //const sObj = this.dbary[idx];
        this.db.putAllDB({ obj: ary[idx], coname: coName, index: idx }).subscribe({
          next: (result) => {
            const { message, data } = result as { message: string, data: any };
            if (message.indexOf('success') > -1) {
              const rObj = data as { idx: number, ans: string }
              if (rObj.idx < ary.length) {
                this.formError = `${coName}~${rObj.idx}:${rObj.ans}; `;
                console.log(data);
              } else {
                this.formError = `${coName}:資料庫備份成功`;
              }
            } else {
              this.formError = `${coName}:資料庫備份失敗`;
            }
            console.log(this.formError);
          },
          error: (err: HttpErrorResponse) => {
            const errResult = err.error as { message: string, data: any };
            this.formError = `${coName}:資料庫備份失敗;`; + errResult.message;
          }
        });
      }
      idx += 1;
    }

  }

}

