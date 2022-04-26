import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router'
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

import { SERVICE } from '../service/web3.service';
import Swal from 'sweetalert2'
import { NgxSummernoteModule } from 'ngx-summernote';
const Moralis = require('moralis');
const axios = require('axios');
import moment from 'moment';
declare var $: any;
const _auction = Moralis.Object.extend("auction");
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cafe',
  templateUrl: './cafe.component.html',
  styleUrls: ['./cafe.component.css']
})
export class CafeComponent implements OnInit {


  _content: FormGroup;

  userIsConnected:any;
  user:any;
  connected:boolean;
  service:any;
  web3:any;
  host:any;
  loading:boolean;
  HOST:any;
  START:any;
  END:any;
  EARNINGS:any;
  CONTENT1:any;
  CONTENT2:any;
  CONTENT3:any;
  CONTENT4:any;
  media:any;
  fileUploading:boolean;

  connectionsOpen:boolean;
  connectionCount:any;
  connectionNFT:any;
  connectionHistory:any;
  connectionEarnings:any;
  hostPower:any;

  viewerConnectTo:any;
  viewerConnectionStart:any;
  viewerConnectionEnd:any;
  viewerConnectionPaidToHost:any;
  viewerPower:any;

  passConnected:boolean;
  passConnectedTo:any;
  paidToHost:any;

  constructor(protected sanitizer: DomSanitizer,private formBuilder: FormBuilder, private _service: SERVICE, private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {


    this.service = _service;
    this.loading = true;
    this.createForm();

  }

  async ngOnInit() {

    this.host = this.route.snapshot.params.user
    this.user = localStorage.getItem('user');
    const appId = environment.moralisKey;
    const serverUrl = environment.moralisSerer;
    Moralis.start({ serverUrl, appId });
    this.start();

  }

  async start(){

    console.log('starting ' + this.user)
    // let power:any = await this.service.GET_PROFILE1(this.user);
    // this.POWER = power[3];
    if(this.host==this.user){

      this.service.START_TEAPASS_HOST(this.user)
      .then(async(res:any)=>{
        this.connectionsOpen = res[0];
        this.connectionNFT = res[1];
        this.connectionHistory = res[2]
        this.connectionEarnings = res[3];
        this.connectionCount = res[4];
        this.hostPower = res[5];
        this.loading = false;
        this.getContent();
        console.log(res)
      })

    }else{

      this.service.START_TEAPASS_VIEWER(this.user,this.host)
      .then(async(res:any)=>{
        this.connectionsOpen = res[0];
        this.connectionNFT = res[1];
        this.viewerConnectTo = res[2].toLowerCase();
        this.viewerConnectionStart = new Date(res[3]*1000);
        // let start = moment().format('MMMM Do YYYY, h:mm:ss a');
        // console.log(start)
        this.viewerConnectionEnd = res[4];
        this.viewerConnectionPaidToHost = res[5];
        this.viewerPower = res[6];
        this.loading =false;
        this.getContent();
        console.log(res)
      })

    }


    // console.log(power)
    // const _uProfile = Moralis.Object.extend("profile");
    // const _query = new Moralis.Query(_uProfile);
    // _query.equalTo('user',this.host);
    // const results = await _query.first();
    // this.HOST = results;
    // if(!this.HOST){
    //   console.log('no collector')
    //   this.showCreateProfile = true;
    //   //console.log(this.HOST)
    //
    // }else{
    //   //console.log(this.HOST)
    //   let avatar = this.HOST.get('avatar');
    //
    //   if(avatar>0){
    //
    //     this.showProfile = true;
    //     ///get users cafe contents
    //
    //   }else{
    //
    //   }
    //   this.getContent();
    // }
    // this.loading = false;
    // if(this.host!=this.user){
    //   let res:any = await this.service.GET_TEAPASS_CONNECTION_COUNT(this.host,this.user);
    //   if(res.imconnectTo.toLowerCase()==this.host){
    //     this.passConnected = true;
    //   }
    // }else{
    //   this.passConnected = false;
    // }
    //
    //
    // this.START = moment().format('X');
    // this.END = moment().add(4, 'hours').format('X');
    // let time = this.END - this.START;
    // let totalTime = time/60;
    // let rate = 3000000*10**9;
    // this.EARNINGS = totalTime*rate;
    //console.log(totalTime*rate);

    // setInterval(()=>{
    //
    // },3000)
  }

  async UPLOAD(){

    this.fileUploading = true;
    let toFile = event.target.files[0]
    const imageFile = new Moralis.File(toFile.name,toFile)
    await imageFile.saveIPFS();
    this.imageURI= await imageFile.ipfs();
    this.zone.run(()=>{

        this.media = this.imageURI
        if(this.media){
          this.fileUploading = false;
          this.pop('success', 'file uploaded');
        //  console.log(this.mediaURL)
        }
  })
  }

  async ADDCONTENT(){

    let type = this._content.controls.type.value;
    if(type==1 && !this.media){
      this.pop('error', 'upload picture 1st');
    }else if(type==2 && !this.media){
      this.pop('error', 'upload video 1st');
    }else if((type==3 || type==4) && !this._content.controls.embed){
        this.pop('error', 'add embed code');
    }else{

      const _uCafe = Moralis.Object.extend("cafe");
      const _p = new _uCafe();

      _p.save({

        type:type,
        media:this.media,
        embed:this._content.controls.embed.value,
        story:this._content.controls.story.value,
        user:this.user,
        active:1

      }).then(()=>{

        this.pop('success', 'content added');
        this.start();

      })
    }

  }
  async getContent(){

    let _uContent = Moralis.Object.extend("cafe");
    let _query = new Moralis.Query(_uContent);
    _query.equalTo('user',this.host.toLowerCase());
    _query.equalTo('active',1);
    _query.equalTo('type', '1');
    let results = await _query.find();
    this.CONTENT1 = results;

    _query.equalTo('user',this.host.toLowerCase());
    _query.equalTo('active',1);
    _query.equalTo('type', '2');
    results = await _query.find();
    this.CONTENT2 = results;

    _query.equalTo('user',this.host.toLowerCase());
    _query.equalTo('active',1);
    _query.equalTo('type', '3');
    results = await _query.find();
    this.CONTENT3 = [];
    for (let i = 0; i < results.length; i++) {
      let embed = this.sanitizer.bypassSecurityTrustHtml(results[i].get('embed'));
      this.CONTENT3.push({embed:embed,story:results[i].get('story')});

    }

    _query.equalTo('user',this.host.toLowerCase());
    _query.equalTo('active',1);
    _query.equalTo('type', '4');
    results = await _query.find();
    this.CONTENT4 = [];
    for (let i = 0; i < results.length; i++) {
      let embed = this.sanitizer.bypassSecurityTrustHtml(results[i].get('embed'));
      this.CONTENT4.push({embed:embed,story:results[i].get('story')});

    }
    // console.log(this.CONTENT3)
  }

  async CONNECT(){

    if(!this.connectionsOpen){
      this.pop('error','this tea pass is not open for connections');
    }else{

      this.service.TEAPASS_CONNECT(this.user, this.host)
      .then(async(res:any)=>{
        if(res.success){

            this.pop('success', 'connecting shortly');

        }else{

          this.pop('success', res.msg);

        }
      })
    }

  }

  async ALLOW_CONNECTIONS(){
    let nft = this._allow.controls.nft.value;
    if(!nft){
      nft = 0
    }
    this.service.TEAPASS_ALLOW_CONNECTIONS(this.user,nft)
    .then(async(res:any)=>{
      if(res.success){

          this.pop('success', 'processing..');

      }else{

        this.pop('error', res.msg);

      }
    })
  }

  async DISCONNECT(){

    this.service.TEAPASS_DISCONNECT(this.user)
    .then(async(res:any)=>{
      if(res.success){

          this.pop('success', 'processing...');

      }else{

        this.pop('success', res.msg);

      }
    })
  }

private curday(sp){

  let today:any = new Date();
  let dd:any = today.getDate();
  let mm:any = today.getMonth()+1; //As January is 0.
  let yyyy:any = today.getFullYear();

  if(dd<10) dd='0'+dd;
  if(mm<10) mm='0'+mm;
  return (mm+sp+dd+sp+yyyy);

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

async getSession(event){

  }
createForm(){

  this._content = this.formBuilder.group({

    type: [''],
    embed:[''],
    story:['']

  });
  this._allow = this.formBuilder.group({

    nft: ['']
  });
}



}
