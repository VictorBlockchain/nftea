import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
  }
  async getSession(event:any){
    console.log(event)
  }
}
