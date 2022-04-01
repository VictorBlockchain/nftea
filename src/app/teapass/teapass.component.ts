import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
const Moralis = require('moralis');
import { SERVICE } from '../service/web3.service';
import { CAFESERVICE } from '../service/cafe.service';
import Swal from 'sweetalert2'
import moment from 'moment';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cafe',
  templateUrl: './teapass.component.html',
  styleUrls: ['./teapass.component.css']
})
export class TeapassComponent implements OnInit {

  _allow: FormGroup;
  _connect: FormGroup;
  _disconnect: FormGroup;

  user:any;
  connected:boolean;
  CREATORS:any;
  CREATORisLIVE:any;
  CONNECTION:any;
  showContent:boolean;
  EMBED:any;
  myHost:any;
  TEAPOT:any;
  service:any;
  constructor(protected sanitizer: DomSanitizer,private formBuilder: FormBuilder, private _service: SERVICE, private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {

    this.service = _service;
    this.createForm();

  }

  ngOnInit() {

    const appId = environment.moralisKey;
    const serverUrl = environment.moralisSerer;
    Moralis.start({ serverUrl, appId });

    this.user = localStorage.getItem('user');
    if(this.user){

      this.connected = true;

      this.start();

    }else{

      console.log("no user")

    }
  }

  async start(){
    //get host profile
    this.CREATORisLIVE  = await this.service.GET_TEAPASS_CREATOR(this.user);
    this.TEAPOT = await this.service.GET_TEAPOT_BALANCE();

    this.CREATORS = [];
    const _uCafe = Moralis.Object.extend("cafe");
    const _query = new Moralis.Query(_uCafe);
    _query.equalTo('active',1);
    const results = await _query.find();
    for (let i = 0; i < results.length; i++) {
    const object = results[i];

      let user = object.get('user');
      let type = object.get('type');
      let embed = object.get('embed');
      let power = object.get('power');
      let start = object.get('start');
      let earnings = object.get('earnings');
      let res:any = await this.service.GET_TEAPASS_CONNECTION_COUNT(user,this.user);
      let connected;
      if(res.imconnectTo.toLowerCase()==user){
        connected = true;
        this.myHost = user;
      }
      this.CREATORS.push({user:user,type:type,embed:embed,start:start,power:power,earnings:earnings,connections:res.count,connected:connected});
      // console.log(this.CREATORS);
    }
  }

  async ALLOW(){

    let power:any = await this.service.GET_PROFILE1(this.user);
    // console.log(power);
    power = power[3];
    //console.log(power);
    if(!this._allow.controls.type.value){
      this.pop('error', 'what type of content are you offering');
    }else if(!this._allow.controls.embed.value){
      this.pop('error', 'what is the embed code?');

    }else if(power<10000){

        this.pop('error', 'your power level is too low to allow connections');

    }else{

        let _sips = [];
        let _cohosts = [];

      this.service.TEAPASS_ALLOW_CONNECTSION(this.user,_cohosts,_sips,this._allow.controls.type.value,this._allow.controls.embed.value,power)
      .then(async(res:any)=>{
        if(res.success){
            this.pop('success', 'allowing connections shortly')
        }else{
          this.pop('success', res.msg)

        }
      })

    }

  }
  async ENDCONNECTION(){

    // const _cafe = Moralis.Object.extend("cafe");
    // const _query = new Moralis.Query(_cafe);
    // _query.equalTo('user',this.user);
    // _query.equalTo('active', 1);
    // const results = await _query.first();
    // if(results){
    //   // console.log(results);
    //   results.set('active',0);
    //   results.save()
    //   .then((res:any)=>{
    //      this.pop('success','connection closed');
    //   })
    // }
  }
  async CLOSE(){
    console.log('closing')
    this.service.TEAPASS_CLOSE_CONNECTSION(this.user,this.myHost)
    .then(async(res:any)=>{
      if(res.success){
          this.pop('success', 'closing connections shortly')
      }else{
        this.pop('success', res.msg)

      }
    })
  }
  async GETROOMS(){

    const _uCafe = Moralis.Object.extend("cafe");
    const _query = new Moralis.Query(_uCafe);
    _query.equalTo('active',1);
    const results = await _query.first();
    if(results){
      console.log(results)
    }

  }

  async CONNECT(connectTo:any, embed:any){

    this.service.TEAPASS_CONNECT(this.user, connectTo)
    .then(async(res:any)=>{
      if(res.success){

          this.pop('success', 'connecting shortly');

      }else{

        this.pop('success', res.msg);

      }
    })
  }
  async DISCONNECT(){

    this.service.TEAPASS_DISCONNECT(this.user)
    .then(async(res:any)=>{
      if(res.success){

          this.pop('success', 'connecting shortly');

      }else{

        this.pop('success', res.msg);

      }
    })
  }
  async SHOW(host:any,embed:any){
    this.showContent = true;
    this.EMBED = this.sanitizer.bypassSecurityTrustHtml(embed);
    //this.EMBED = embed;

    //console.log(this.EMBED)
  }
  async getSession(event){

  }
  private DATE(_value){
    //console.log(_value);
    return moment(_value*1000).fromNow();
    //return new Date(_value * 1000);
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

  createForm(){

    this._allow = this.formBuilder.group({

      type: [''],
      embed:['']

    });
    this._connect = this.formBuilder.group({

      to: ['']

    });
    this._disconnect = this.formBuilder.group({

      from: ['']

    });

  }
}
