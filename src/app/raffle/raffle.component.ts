import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
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
  selector: 'app-raffle',
  templateUrl: './raffle.component.html',
  styleUrls: ['./raffle.component.css']
})
export class RaffleComponent implements OnInit {

  userIsConnected: any;
  user: any;
  api: any;
  _create: FormGroup;
  connected: boolean;
  service: any;
  loading: boolean;
  PRICES:any;

  constructor(private formBuilder: FormBuilder, private _service: SERVICE, private zone: NgZone, private cd: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {


    this.service = _service;
    this.loading = true;
    this.createForm();

  }

  ngOnInit() {

      this.user = localStorage.getItem('user');
      this.PRICE();

  }
  async PRICE(){
    let price:any = await  this.service.GET_PRICE();
    this.PRICES = price.usdPrice.toFixed(12);
    setInterval(async()=>{

      price = await  this.service.GET_PRICE();
      this.PRICES = price.usdPrice.toFixed(12);
      //console.log(this.PRICES);


    },15000);
  }
  async SET_CREATE() {

    let start = moment().add(15, 'minutes').format('X');

    if (!this._create.controls.title.value) {
      this.pop('error', 'whats the title?');
    } else if (!this._create.controls.type.value) {
      this.pop('error', 'is this game for token or nft?');
    } else if (this._create.controls.type.value == 1 && !this._create.controls.token.value) {
      this.pop('error', 'what token is this game for?');
    }
    else if (this._create.controls.type.value == 2 && !this._create.controls.nft.value) {
      this.pop('error', 'what nft is this game for?');
    } else if (!this._create.controls.value.value) {
      this.pop('error', 'what is the value of the prize?');
    } else if (this._create.controls.entryFee.value < 1 && this._create.controls.hodlBalance.value < 1) {
      this.pop('error', 'what is the entry fee for this game?');
    } else if (!this._create.controls.minPlayers.value) {
      this.pop('error', 'how many players do you want in this game?');
    } else {
      let nft;
      let token;
      if(!this._create.controls.nft.value){
        nft = 0;
      }else{
        nft = this._create.controls.nft.value;
      }
      if(!this._create.controls.token.value){
        token = this.user;
      }else{
        token = this._create.controls.token.value;
      }
      console.log(token)
      this.service.SET_HANDS(this.user,this._create.controls.type.value,this._create.controls.title.value,token,nft,this._create.controls.value.value,this._create.controls.entryFee.value,this._create.controls.hodlBalance.value,this._create.controls.minPlayers.value,start)
      .then(async(res:any)=>{
        if(res.success){
          this.pop('success', 'hands game created');
        }else{
          this.pop('error', res.msg);
          console.log(res);
        }
      })
    }
  }

  private earnings(){
    let prize = this._create.controls.value.value * this.PRICES;
    let total:any = this._create.controls.entryFee.value * this._create.controls.minPlayers.value;
    total = (total * this.PRICES) - prize;
    return total;

  }
  private pop(type, message) {
    let title;
    if (type == 'error') {
      title = 'Error!'
    } else {
      title = 'Success!'
    }

    Swal.fire({
      title: title,
      text: message,
      icon: type,
      confirmButtonText: 'Close'
    })
  }
  createForm() {

    this._create = this.formBuilder.group({


      title: [''],
      type: [''],
      token: [''],
      nft: [''],
      value: [''],
      entryFee: [''],
      hodlBalance: [''],
      minPlayers: ['']

    });


  }
}
