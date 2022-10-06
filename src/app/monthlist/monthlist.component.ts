import { Component, OnInit } from '@angular/core';
import { FaccountAnalystService } from '../fservice/faccount-analyst.service';
import { Cunsume } from '../fclass/cunsume';
import { FaccountDataService } from '../fservice/faccount-data.service';
import { Para } from '../fclass/para';
class smy {
  "paraType": string;
  "paraName": string;
  "paraText": string;
  "paraNo": number;
  "paraMemo": string;

}
@Component({
  selector: 'app-monthlist',
  templateUrl: './monthlist.component.html',
  styleUrls: ['./monthlist.component.css']
})
export class MonthlistComponent implements OnInit {
  viewModel = {
    "years": ['2020', '2021', '2022', '2023', '2024', '2025'],
    'months': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    'users': ['All', 'Martin', 'Katy']
  };
  model = {
    'cyear': '',
    'cmonth': '',
    'user': 'All'
  }
  summary = {
    'martin': 0,
    'katy': 0,
    'monthSum': 0,
    'remainder': 0,
    'budget': 100000
  }
  summaryText = {
    'martinText': '',
    'katyText': '',
    'monthText': '',
    'remainderText': '',
    'title': '',
    'budget': ''
  }
  theList: Cunsume[] | undefined;
  martinList: Cunsume[] | undefined;
  katyList: Cunsume[] | undefined;
  theSelected: Cunsume | undefined;
  hasSelected = false;
  formError: string = '';
  showMain = true;
  constructor(private analystService: FaccountAnalystService,
    private dataService: FaccountDataService) { }

  ngOnInit() {
    const theDate = new Date();
    const theYear=theDate.getFullYear().toString();
    if(this.viewModel.years.indexOf(theYear)=== -1){
      this.viewModel.years.push(theYear);
    }
    //console.log(this.viewModel.years);
    this.model.cyear = theYear;
    this.model.cmonth = (theDate.getMonth() + 1).toString();
    const tName =this.dataService.getName();
    if(tName){
      this.model.user = tName!;
    }
    setTimeout(() => {
      this.monthBudget();
    }, 100);
    //console.log(this.katyList);
  }


  onSubmit() {
    // console.log(this.model);
    this.analystService.readMonthItems(this.model).subscribe((Response) => {
    //console.log(Response);
    const {data} = Response as {message:string, data:[]};
    // console.log(this.model.user);
    // console.log(data);
      this.theList = data as Cunsume[];
      if(this.theList){
        this.hasSelected=true;
      }
      if (this.model.user === 'Martin') {
        this.martinList = this.theList.filter(x => x.buyer === 'Martin');
        this.katyList = this.theList.filter(x => x.buyer === 'Katy');
        // console.log(this.martinList);
        // console.log(this.katyList);
        if (this.martinList.length === 0 && this.katyList.length === 0) {
          this.martinList = [];
          this.theList = [];
        }
      }
      else if (this.model.user === 'Katy') {
        this.martinList = this.theList.filter(x => x.buyer === 'Martin');
        this.katyList = this.theList.filter(x => x.buyer === 'Katy');
        if (this.martinList.length === 0 && this.katyList.length === 0) {
          this.katyList = [];
          this.theList = [];
        }
      }
      else {
        this.martinList = this.theList.filter(x => x.buyer === 'Martin');
        if (this.martinList.length === 0) {
          this.martinList = [];
        }
        this.katyList = this.theList.filter(x => x.buyer === 'Katy');
        if (this.katyList.length === 0) {
          this.katyList = [];
        }
        if (!this.katyList && !this.martinList) {
          this.theList = [];
        }
      }

    });

  }
  monthTotal() {
    //console.log(this.model);
    this.monthBudget();
    this.analystService.readMonthItems(this.model).subscribe((Response) => {
      const {data} = Response as {message:string, data:[]};
      this.hasSelected=true;
      // console.log(this.model.user);
      // console.log(data);
        this.theList = data as Cunsume[];
      this.martinList = this.theList.filter(x => x.buyer === 'Martin');
      this.katyList = this.theList.filter(x => x.buyer === 'Katy');
      this.summary.martin = this.sum(this.martinList, 'price');
      this.summary.katy = this.sum(this.katyList, 'price');
      this.summary.monthSum = this.sum(this.theList, 'price');
      this.summary.remainder = this.summary.budget - this.summary.monthSum;
      this.summaryText.martinText = `丁瑜支出：${this.summary.martin}元`;
      this.summaryText.katyText = `紋萍支出：${this.summary.katy}元`;
      this.summaryText.monthText = `家庭支出：${this.summary.monthSum}元`;
      this.summaryText.remainderText = `家庭結餘：${this.summary.remainder}元`;
      this.summaryText.title = `${this.model.cyear} 年 ${this.model.cmonth} 月 消費結算`;
      this.summaryText.budget = `本月預算：${this.summary.budget}元`;
      this.martinList = undefined;
      this.katyList = undefined;
      //console.log(this.summary);
    });
  }
  monthBudget() {
    const model: Para = {
      paraType: 'monthBudget',
      paraName: this.GetYearMonth(),
      paraText: '',
      paraNo: 0,
      paraMemo: ''
    }
    this.analystService.getParasByName(model)
      .subscribe((Response) => {
        //console.log(model);
        //console.log(Response);
        const {data} = Response as {message:string, data:[]};
        const ary = data as smy[]
        if (ary.length === 1) {
          this.summary.budget = 100000;
        } else if (ary.length > 1) {
          this.summary.budget = ary[0].paraNo + ary[1].paraNo;
        }
      });
  }

  GetYearMonth() {
    const yrMonth = this.model.cyear + (this.model.cmonth.length === 1 ? '0' + this.model.cmonth : this.model.cmonth);
    return yrMonth;
  }
  strFormat(obj: Cunsume) {
    return ` ${obj.cyear}/ ${obj.cmonth}/ ${obj.cday}`;
  }

  sum = function (items: any, prop: string) {
    return items.reduce(function (a: number, b: any) {
      return a + b[prop];
    }, 0);
  };

  goQuery() {
    this.martinList = undefined;
    this.katyList = undefined;
    this.theList = undefined;
    this.summary.martin = 0;
    this.summary.katy = 0;
    this.summary.monthSum = 0;
    this.summary.remainder = 0;
    this.formError = '';
    this.hasSelected = false;
  }

  onClickEvent(event: MouseEvent, row: Cunsume) {
    this.theSelected = row;
    if (row) {
      this.hasSelected = true;
    }
    //console.log(this.theSelected);
    const cMenu = document.getElementById('contextMenu');

    cMenu!.style.display = cMenu!.style.display === 'block' ? 'none' : 'block';
    cMenu!.style.left = event.clientX.toString() + 'px';
    cMenu!.style.top = event.clientY.toString() + 'px';
  }
  onItemEvent(para: string) {
    if (this.theSelected!.buyer != this.dataService.getName()) {
      //this.formError = "buyer:"+this.theSelected!.buyer + " user:"+this.dataService.getName();
      this.formError = "不能修改或刪除別人建立的帳目";
      return;
    }
    document.getElementById('contextMenu')!.style.display = 'none';
    if (para === 'edit') {
      this.showMain = false;
    } else {
      this.dataService.delItem(this.theSelected!._id).subscribe((Response) => {
        console.log(Response);
        this.onSubmit();
        // const {message} = Response as {message:any};
        // if(message=== 'deleted'){
        //   this.formError = `${this.theSelected!.itemName} 金額:${this.theSelected!.price} 已刪除`;
        //   this.onSubmit();
        //   }
        //   else{
        //     this.formError =message;
        //  }
      });
    }
  }
  getEditResult(ret: boolean) {
    if (ret) {
      this.formError = `名稱：[${this.theSelected!.itemName}] 已修改`;
      this.onSubmit();
    } else {
      this.formError = `名稱：[${this.theSelected!.itemName}] 取消修改`;
    }
    this.theSelected = undefined;
    this.hasSelected = false;
    this.showMain = true;
  }
}
