import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router'
import { ViewportScroller } from "@angular/common";
import { SERVICE } from '../service/web3.service';
const Moralis = require('moralis');

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  type:any;
  service:any;
  NFT:any;
  ALBUM:any;
  album_id;
  constructor(private formBuilder: FormBuilder, private _service: SERVICE, private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {

    this.service = _service;
    this.NFT = []

  }

  ngOnInit() {

    this.album_id = this.route.snapshot.params.id;
    this.start();
    //console.log(this.album_id);
  }

  start(){
    const appId = "";
    const serverUrl = '';
    Moralis.start({ serverUrl, appId });
    this.service.GET_ALBUM(this.album_id)
    .then((res:any)=>{
      this.ALBUM = res;
      //let NFT_BY_ID = res.nfts;
      console.log(res)
      // NFT_BY_ID.forEach(element => {
      //
      //   let id = element[i];
      //   //get nft
      //   this.service.GET_NFT(id,0)
      //   .then(async(jordi:any)=>{
      //
      //     console.log(jordi)
      //
      //   })
      //
      // });

    })


  }

  async getSession(event){

  }
}
