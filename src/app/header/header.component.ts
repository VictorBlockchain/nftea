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

      Moralis.authenticate({signingMessage: 'NFTEA.app', provider:'walletconnect',chainId: environment.CHAIN }).then((user)=> {
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
    // this.service.GET_SHIT_BALANCE(this.user)
    // .then((res:any)=>{
    //   this.satoBalance = res/1000000000;
    //   this.listener();
    //   this.GET_PROFILE1();
    //   //console.log(res);
    // })
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
