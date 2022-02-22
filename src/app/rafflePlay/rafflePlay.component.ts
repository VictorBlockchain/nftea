import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router'
import { SERVICE } from '../service/web3.service';
import Swal from 'sweetalert2'
import { NgxSummernoteModule } from 'ngx-summernote';
const Moralis = require('moralis');
const axios = require('axios');
import moment from 'moment';
declare var $: any;
const NFT = "0xD85581FE86ca9185539A6F6F460163F392BA9Fd0";
const _auction = Moralis.Object.extend("auction");

@Component({
  selector: 'app-rafflePlay',
  templateUrl: './rafflePlay.component.html',
  styleUrls: ['./rafflePlay.component.css']
})
export class RafflePlayComponent implements OnInit {

  userIsConnected:any;
  user:any;
  api:any;
  _create: FormGroup;
  connected:boolean;
  service:any;
  showGame:boolean;
loading:boolean;
  constructor(private formBuilder: FormBuilder, private _service: SERVICE, private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {


    this.service = _service;
    this.loading = true;
    this.showGame = false;
    this.createForm();

  }

  ngOnInit() {
  }

  createForm(){

    this._create = this.formBuilder.group({


      title: [''],
      type:[''],
      token:[''],
      nft:[''],
      value:[''],
      entryFee:[''],
      hodlBalance:[''],
      minPlayers:['']

    });


  }
}
