import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef,Input,Output,EventEmitter } from "@angular/core";
import { Renderer } from '@angular/core';
import { SERVICE } from '../service/web3.service';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router';
import Swal from 'sweetalert2';
const Moralis = require('moralis');
import { DeviceDetectorService } from 'ngx-device-detector';
const ABISHOP = require('../../build/teashop/artifacts/abi.json');
const TEASHOP = "0xF29BFeF0122a67616FA64e3D49752067d2367df7";
import { environment } from '../../environments/environment';
declare var window:any
declare var $: any;
@Component({
  selector: 'app-header',
  //template:'<app-session></app-session>',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() session: EventEmitter<any> = new EventEmitter();
  user:any
  userIsConnected:any
  avatar:string
  name:string
  balance:number
  service:any
  web3:any
  connected:boolean
  type:any
  burger:any

  header:any
  items:any
  item:any
  mobile:any
  head:any
  body:any

  address:any
  auth:any
  satoBalance:any
  isMobile:boolean
  friend:any
  constructor(private deviceService: DeviceDetectorService,private zone: NgZone,private cd: ChangeDetectorRef,public _service: SERVICE,private route: ActivatedRoute,private router: Router) {

    this.service = _service;

  }

  ngOnInit(): void {

    const appId = environment.moralisKey;
    const serverUrl = environment.moralisSerer;
    Moralis.start({ serverUrl, appId });
    this.init();
  }
  async init(){

    this.userIsConnected = await Moralis.User.current();
    if(this.userIsConnected){

      this.connected = true;
      this.user = localStorage.getItem('user');
      this.friend = localStorage.getItem('friend');
      this.start();
    }
    	const header = $('.js-header'),
    		popup = header.find('.avatar_popup'),
    		icon = header.find('.header__avatar'),
        popup2 = header.find('.notifications_popup'),
    		icon2 = header.find('.header__notifications');

    	icon.on('click', function (e) {
    		e.stopPropagation();
    		popup.toggleClass('visible');
    	});
      icon2.on('click', function (e) {
        e.stopPropagation();
        popup2.toggleClass('visible');
      });
    	$(document).on('click', 'body', function (e) {
    		if (!$(e.target).is('.visible'))
    			popup.removeClass('visible');
          popup2.removeClass('visible');
    	})


  }

  async getConnected(){

    if(this.isMobile){

      Moralis.authenticate({signingMessage: 'NFTEA.app', provider:'walletconnect',chainId: 56 }).then((user)=> {
        //console.log(user);
        this.connected = true;
        this.user = user.get('ethAddress')
        localStorage.setItem('user',this.user);
        this.start();
          //console.log(user.get('ethAddress'))
      })
    }else if(!this.isMobile){

      Moralis.authenticate({signingMessage: 'NFTEA.app'}).then((user)=> {
        //console.log(user);
        this.connected = true;
        this.user = user.get('ethAddress')
        localStorage.setItem('user',this.user);
        this.start();
          //console.log(user.get('ethAddress'))
      })
    }

  }
  async start(){
    // alert('working' + this.user)
    this.session.emit(this.user);
    this.service.GET_SHIT_BALANCE(this.user)
    .then((res:any)=>{
      this.satoBalance = res/1000000000;
      this.listener();
      this.GET_PROFILE1();
      //console.log(res);
    })
  }
  async GET_PROFILE1(){
    this.service.GET_PROFILE1(this.user)
      .then(async(res:any)=>{
        if(res.active<1){

        }
        if(this.friend){
          this.SET_FRIEND();
        }
      //  console.log(res);
      })
  }
  async SET_FRIEND(){

    // const _Referral = Moralis.Object.extend("referrals");
    // const _query = new Moralis.Query(_Referral);
    // _query.equalTo('user',this.user);
    // _query.equalTo('friend',this.friend);
    // const results = await _query.first();
    // if(!results){
    //   ///enter
    // }
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
      html: message,
      icon: type,
      confirmButtonText: 'Close'
    })
  }
  async listener(){
      //console.log('listening')
      // let web3 = await Moralis.enableWeb3({provider:'walletconnect'});
      // const contract = new web3.eth.Contract(ABISHOP, TEASHOP);
      // contract.events.allEvents()
      // .on('data',(event) => {
      //   console.log(event);
      //   if(event.event=='auctionListed'){
      //     //console.log(event.returnValues._seller.toLowerCase(), this.user.toLowerCase());
      //     if(event.returnValues._seller.toLowerCase()==this.user.toLowerCase()){
      //       console.log("setting auction");
      //       const _auction = Moralis.Object.extend("auction");
      //       const _query = new Moralis.Query(_auction);
      //       _query.equalTo('seller',this.user.toLowerCase());
      //       _query.equalTo('nft', event.returnValues._nft);
      //       _query.equalTo('active',1);
      //       _query.first()
      //       .then((results:any)=>{
      //         console.log(results)
      //         if(!results){
      //
      //           const _p = new _auction();
      //           _p.save({
      //
      //             seller:event.returnValues._seller.toLowerCase(),
      //             nft:event.returnValues._nft,
      //             market:event.returnValues._market,
      //             buyer:event.returnValues._seller.toLowerCase(),
      //             active:1,
      //             sold:0
      //
      //           }).then(()=>{
      //             console.log("auction listed");
      //             //this.pop('success', 'profile created');
      //           })
      //         }
      //       })
      //     }
      //   }else if(event.event=="auctionClosed"){
      //
      //     // console.log(event.returnValues._buyer.toLowerCase(), this.user.toLowerCase());
      //     const _auction = Moralis.Object.extend("auction");
      //     const _query = new Moralis.Query(_auction);
      //     _query.equalTo('seller',this.user.toLowerCase());
      //     _query.equalTo('active',1);
      //     _query.first()
      //     .then((results:any)=>{
      //       console.log(results)
      //
      //       if(results){
      //
      //         if(event.returnValues._seller.toLowerCase()==this.user.toLowerCase()){
      //           let sold = 0;
      //           if(event.returnValues._buyer.toLowerCase()!=this.user.toLowerCase()){
      //             sold = 1;
      //           }
      //           const _auction = Moralis.Object.extend("auction");
      //           const _query = new Moralis.Query(_auction);
      //           _query.equalTo('seller',this.user.toLowerCase());
      //           _query.equalTo('nft', event.returnValues._nft);
      //           _query.equalTo('active',1);
      //           _query.first()
      //           .then(async(res:any)=>{
      //             //console.log(res)
      //             res.set('active',0);
      //             res.set('sold',sold);
      //             res.set('buyer',event.returnValues._buyer.toLowerCase());
      //             res.save();
      //             // _query.save(res);
      //             // console.log('auction canceled');
      //
      //           })
      //
      //         }
      //       }
      //       })
      //   }
      // })
      // .on('error', console.error);
    }
  logout(){

    Moralis.User.logOut();
    this.pop('success','logging you out')
    this.connected = false
    this.user = null;
    this.satoBalance = 0;
    localStorage.clear();
    this.session.emit(null);

  }
  burgerClick():void{

    $(document).ready(function(){

      this.header = $('.js-header'),
      this.item = this.header.find('.js-header-item'),
      this.mobile = this.header.find('.js-header-mobile'),
      this.burger = this.header.find('.js-header-burger'),

      this.burger.toggleClass('active'),
      this.mobile.toggleClass('visible');

      this.items.each(function () {
    		this.item = $(this),
    			this.head = this.item.find('.js-header-head'),
    			this.body = this.item.find('.js-header-body');

    		this.head.on('click', function (e) {
    			e.stopPropagation();

    			if (!this.item.hasClass('active')) {
    				this.items.removeClass('active');
    				this.item.addClass('active');
    			} else {
    				this.items.removeClass('active');
    			}
    		});

    		this.body.on('click', function (e) {
    			e.stopPropagation();
    		});

    		$('html, body').on('click', function () {
    			this.items.removeClass('active');
    		});

    	});
    })

}

}
