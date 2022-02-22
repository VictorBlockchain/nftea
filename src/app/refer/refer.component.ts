import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router'
import { ViewportScroller } from "@angular/common";

@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.css']
})
export class ReferComponent implements OnInit {

  friend:any;
  type:any;
  constructor(private route: ActivatedRoute,private router: Router,private scroller: ViewportScroller) { }

  ngOnInit() {
    this.friend = this.route.snapshot.params.user;
    if(this.friend){
      localStorage.setItem('fried',this.friend);
    }
    //console.log(this.type);
  }

  start(type:any){
        this.scroller.scrollToAnchor(this.type);
  }
  async getSession(event){

  }
}
