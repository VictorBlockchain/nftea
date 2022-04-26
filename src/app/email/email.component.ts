import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  to:any;
  type:any;

  constructor() { }

  ngOnInit() {

    this.type = this.route.snapshot.params.type;
    this.to = this.route.snapshot.params.to;
    this.start(this.type,this.to);

  }

  start(type:any,to:any){

    //1 = auction created
    //2 = bid placed
    //3 = buy now placed
    //4 = aunction canceled
    //5 = user signup
    //6 = user login
    //7 = teapass connected
    //8 = honey added
    //9 = token received

    if(type==1){

    }
    if(type==2){

    }
    if(type==3){

    }
    if(type==4){

    }
    if(type==5){

    }
    if(type==6){

    }
    if(type==7){

    }
    if(type==8){

    }
    if(type==9){

    }
  }

}
