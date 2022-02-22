import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router'
import { ViewportScroller } from "@angular/common";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  type:any;
  constructor(private route: ActivatedRoute,private router: Router,private scroller: ViewportScroller) { }

  ngOnInit() {
    this.type = this.route.snapshot.params.type;
    this.start(this.type);
    //console.log(this.type);
  }

  start(type:any){
        this.scroller.scrollToAnchor(this.type);
  }
  async getSession(event){

  }
}
