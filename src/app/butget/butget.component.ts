import { Component, OnInit } from '@angular/core';
import { Para } from '../fclass/para';
import { FaccountAnalystService } from '../fservice/faccount-analyst.service';

class smy {
  "paraType": string;
  "paraName": string;
  "paraText": string;
  "paraNo": number;
  "paraMemo": string;

}

@Component({
  selector: 'app-butget',
  templateUrl: './butget.component.html',
  styleUrls: ['./butget.component.css']
})
export class ButgetComponent implements OnInit {
  formError = '';
  cyear = '';
  cmonth = '';
  viewModel = {
    "years": ['2020', '2021', '2022', '2023', '2024', '2025'],
    'months': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  };
  paraMartin: Para = {
    paraName: '',
    paraType: 'monthBudget',
    paraText: '',
    paraNo: 0,
    paraMemo: 'Martin'
  };

  paraKaty: Para = {
    paraName: '',
    paraType: 'monthBudget',
    paraText: '',
    paraNo: 0,
    paraMemo: 'Katy'
  };
  constructor(private analystService: FaccountAnalystService) {
    this.SetYearMonth();
  }
  paraAll:any=[];
  ngOnInit() {
    this.queryBudget();
  }
  SetYearMonth() {
    const theDate = new Date();
    const theYear=theDate.getFullYear().toString();
    if(this.viewModel.years.indexOf(theYear)=== -1){
      this.viewModel.years.push(theYear);
    }
    //console.log(this.viewModel.years);
    this.cyear = theYear;
    this.cmonth = (theDate.getMonth() + 1).toString();
    if (this.viewModel.years.indexOf(this.cyear) === -1) {
      this.viewModel.years.push(this.cyear);
    }
    //const yrMonth= cyear + (cmonth.length === 1 ? '0'+cmonth :cmonth);

  }
  GetYearMonth() {
    const yrMonth = this.cyear + (this.cmonth.length === 1 ? '0' + this.cmonth : this.cmonth);
    return yrMonth;
  }
  queryBudget() {
    this.formError='';
    const model: Para = {
      paraType: 'monthBudget',
      paraName: this.GetYearMonth(),
      paraText: '',
      paraNo: 0,
      paraMemo: ''
    }
    this.analystService.getParasByName(model)
    .subscribe((Response) => {
      const {data} = Response as {message:string, data:[]};
      const ary = data as smy[]
    this.paraAll=ary;
        //console.log(ary);
        if (ary.length === 1) {
          this.paraMartin.paraNo = 0;
          this.paraKaty.paraNo = 0;
        } else if (ary.length > 1) {
          if (ary[0].paraMemo === 'Martin') {
            this.paraMartin = ary[0];
            this.paraKaty = ary[1];
          } else {
            this.paraMartin = ary[1];
            this.paraKaty = ary[0];
          }
        }
      });
  }

  setBudge() {
    //this.formError='';
    this.paraMartin.paraName = this.GetYearMonth();
    this.paraMartin.paraMemo = 'Martin';
    this.analystService.setParasByName(this.paraMartin)
    .subscribe((Response) => {
      //console.log(Response);
      const obj = Response as {message:any, data:any};
       this.formError = `${obj.data.paraMemo}預算${obj.data.paraNo}元;`;

      });
      setTimeout(() => {
        this.paraKaty.paraName = this.GetYearMonth();
        this.paraKaty.paraMemo = 'Katy';
        this.analystService.setParasByName(this.paraKaty)
        .subscribe((Response) => {
          const obj = Response as  {message:any, data:any};;
          this.formError += `${obj.data.paraMemo}預算${obj.data.paraNo}元;`;

          });
      }, 1000);

  }
  MartinBlur() {
    this.paraKaty.paraNo = this.paraMartin.paraNo;
  }
  clearBudge(){
    this.paraAll.forEach((element: { _id: string; paraMemo: any; }) => {
     setTimeout(() => {
       this.analystService.delById(element._id).subscribe((Response)=>{
         this.formError +=`${element.paraMemo}預算已清除;`;
      })
     }, 100);
   });
  }
}
