import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, Input} from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SERVICE } from '../service/web3.service';
import { environment } from '../../environments/environment';
const Moralis = require('moralis');
const axios = require('axios');
declare var $: any;
declare var window:any
import Swal from 'sweetalert2'
declare var $: any;
import moment from 'moment';

@Component({
  selector: 'home-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private service:any
  balance: any;
  connected:boolean
  //user:string
  loading:boolean;
  teaBalance;
  LOCAL:any;
  MUSIC:any;
  FILM:any;
  HERITAGE = [];
  AVATAR = [];
  COVER = [];
  WALL = [];
  NFT = [];
  AUCTION= [];
  ACTIVE_TAB:any;
  TEAVALUE:any;
  TAB_NAME:any;
  isMobile:boolean;
  @Input() user = '';
  COLLECTOR:any;
  AUCTION:any;

  constructor(private deviceService: DeviceDetectorService,private formBuilder: FormBuilder,private _service: SERVICE,private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {
    this.connected = false;
    this.service = _service;
    this.isMobile = this.deviceService.isMobile();
    this.createForm();
  }

  ngOnInit() {
    // console.log(environment.CHAIN);
    const appId = environment.moralisKey;
    const serverUrl = environment.moralisSerer;
    Moralis.start({ serverUrl, appId });
      this.user = localStorage.getItem('user');
      //alert(this.user);
      //console.log(this.user);
      if(this.user){
        this.connected = true;
        //this.start(6);
        this.GET_HONEY_POT();

      }else{

        setTimeout(() => {
          this.getConnected();
          //this.pop('error', 'please connect your wallet to get started');
        }, 2000);
      }

  }
  async getSession(event:any){

    if(event){
      this.user = event
      // alert(this.user);
      this.connected = true;
      this.start(1);
      await this.GET_HONEY_POT();
    }else{
      this.connected = false;
      this.user = null;
      this.NFT = null;
    }
  }
  async getConnected(){

    if(this.isMobile){

      Moralis.authenticate({signingMessage: 'NFTEA.app', provider:'walletconnect',chain: 56 }).then((user)=> {
        //console.log(user);
        this.connected = true;
        this.user = user.get('ethAddress')
        localStorage.setItem('user',this.user);
        this.start(1);
          //console.log(user.get('ethAddress'))
      })
    }else if(!this.isMobile){

      Moralis.authenticate({signingMessage: 'NFTEA.app'}).then((user)=> {
        //console.log(user);
        this.connected = true;
        this.user = user.get('ethAddress')
        localStorage.setItem('user',this.user);
        this.start(1);
          //console.log(user.get('ethAddress'))
      })
    }

  }
  async start(_market:any){

    console.log("starting " + _market);
    //get profile from database
    this.service.LISTENSHOP();
    const _uProfile = Moralis.Object.extend("profile");
    let _query = new Moralis.Query(_uProfile);
    _query.equalTo('user',this.user);
    let results1 = await _query.first();
    this.COLLECTOR = results1;
    if(!this.COLLECTOR){
      setTimeout(() => {
        this.pop('error', 'lets set up your profile');
      }, 3000);
    }

    // const _Auctions = Moralis.Object.extend("auction");
    // let _query2 = new Moralis.Query(_Auctions);
    // _query2.equalTo('active', 1);
    // _query2.equalTo('market', _market);
    // let results2 = await _query2.find();
    // let auction:any = results2;
    // // console.log(auction);
    // for (let i=0; i<auction.length; i++){
    //   console.log(auction[i].get('seller'), auction[i].get('nft'))
    //   this.service.GET_AUCTION(auction[i].get('nft'),auction[i].get('seller'))
    //   .then(async(res:any)=>{
    //     console.log(res);
    //   })
    // }

    this.service.GET_AUCTION_NFTS(this.user,_market)
    .then(async(res:any)=>{
      let auction:any = res;
      // console.log(res);
      // this.NFT = [];
      for (let i = 0; i < auction.length; i++) {
        const auctionID = auction[i];

        this.service.GET_AUCTION_HOST(auctionID)
        .then(async(res:any)=>{
          console.log(res);

          let host = res.host;
          let nft = res.nft;
          if(nft>0){
            this.AUCTION = await this.service.GET_AUCTION(host,nft);
            // console.log(this.AUCTION);
            let url = this.AUCTION[1];
            url = url.replace('https://ipfs.moralis.io:2053/ipfs/', 'https://gateway.moralisipfs.com/ipfs/');
            //console.log(url);
            let ipfs = await axios.get(url);
            ipfs.data.nft_id = nft;
            ipfs.data.auction = this.AUCTION;
            ipfs.data.auction.seller = host;
            this.NFT.push(ipfs.data);
            console.log(this.NFT);
          }

        })

        // let ipfs = await axios.get(auctionID.token_uri);
        // this.NFT.push(ipfs.data);
        // console.log(this.NFT);

      }
      this.markets(_market);

    })


  }
  async changeMarket(_market:any){

    this.zone.run(()=>{
      this.NFT = []

      setTimeout(() => {
        this.start(_market);
      }, 500);
    })

  }
  async markets(_market){

      if(_market==1){
        this.ACTIVE_TAB = 1;
        this.TAB_NAME = 'Avatars'
      }
      if(_market==2){
        this.ACTIVE_TAB = 2;
        this.TAB_NAME = 'Photography'

      }
      if(_market==3){
        this.ACTIVE_TAB = 3;
        this.TAB_NAME = 'Heritage'

      }
      if(_market==4){
        this.ACTIVE_TAB = 4;
        this.TAB_NAME = 'WALL'

      }
      if(_market==5){
        this.ACTIVE_TAB = 5;
        this.TAB_NAME = 'Film/Video'

      }
      if(_market==6){
        this.ACTIVE_TAB = 6;
        this.TAB_NAME = 'Art & All'

      }
      if(_market==7){
        this.ACTIVE_TAB = 7;
        this.TAB_NAME = 'Music'

      }
      if(_market==8){
        this.ACTIVE_TAB = 8;
        this.TAB_NAME = 'Prison'

      }
      if(_market==9){
        this.ACTIVE_TAB = 9;
        this.TAB_NAME = 'Sexy Women'

      }
      if(_market==10){
        this.ACTIVE_TAB = 10;
        this.TAB_NAME = 'Sexy Men'

      }
  }

  async GET_HONEY_POT(){
    // alert("getting honey pot");
    this.service.GET_TEAPOT_BALANCE(1)
    .then(async(res:any)=>{
      // alert(res);
        this.teaBalance = res/1000000000;
      // console.log(this.teaBalance);
    })
    //this.PRICE();
  }
  async PRICE(){
    let price:any = await  this.service.GET_PRICE();
    this.TEAVALUE = price.usdPrice.toFixed(18);
    setInterval(async()=>{

      price = await  this.service.GET_PRICE();
      this.TEAVALUE = price.usdPrice.toFixed(18);
      // console.log(this.TEAVALUE);

    },15000);
  }

  private pop(type,message){
    let title;
    if(type=='error'){
      title = 'Error!'
    }else{
      title = 'Success!'
    }

    Swal.fire({
      title: title,
      text: message,
      icon: type,
      confirmButtonText: 'Close'
    })
  }


  private createForm() {



}

}
