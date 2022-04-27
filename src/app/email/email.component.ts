import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router'

import { environment } from '../../environments/environment';
import { SERVICE } from '../service/web3.service';
const axios = require('axios');
const Moralis = require('moralis');

// const mailjet = require('node-mailjet').connect(
//   environment.MJ_APIKEY_PUBLIC,
//   environment.MJ_APIKEY_PRIVATE
// )
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  to:any;
  type:any;
  email:any;
  subject:any;
  message:any;
  name:any;
  nft_id:any;
  service:any;
  NFT:any;
  COLLECTOR:any;

  constructor(private _service: SERVICE,private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {
    this.service = _service;
  }

  ngOnInit() {

    this.type = this.route.snapshot.params.type;
    this.to = this.route.snapshot.params.to;
    this.nft_id = this.route.snapshot.params.nft;
    this.start(this.type,this.to);

  }

  async start(type:any,to:any){

    //1 = auction created
    //2 = bid placed
    //3 = buy now placed
    //4 = aunction canceled
    //5 = user signup
    //6 = user login
    //7 = teapass connected
    //8 = honey added
    //9 = token received

    const _uProfile = Moralis.Object.extend("profile");
    const _query = new Moralis.Query(_uProfile);
    _query.equalTo('user',to);
    const results = await _query.first();
    this.COLLECTOR = results;
    this.email = this.COLLECTOR.get('email');
    this.name = this.COLLECTOR.get('name');

    if(this.nft_id>0){
      this.service.GET_NFT(this.nft_id,0)
      .then(async(jordi:any)=>{
        //console.log(jordi)
        let url = jordi.ipfs;
        url = url.replace('https://ipfs.moralis.io:2053/ipfs/', 'https://gateway.moralisipfs.com/ipfs/');
        let ipfs = await axios.get(url);
        this.NFT = ipfs.data;
      })

    }

    if(type==1){
      this.subject = 'auction created';
      this.message = '';
    }
    if(type==2){
      this.subject = 'YOU GOT A BID!';
      this.message = '';

    }
    if(type==3){
      this.subject = 'SALE! A COLLECTOR BOUGHT YOUR WORK!';
      this.message = '';

    }
    if(type==4){
      this.subject = 'auction canceled';
      this.message = '';

    }
    if(type==5){
      this.subject = 'auction canceled';
      this.message = '';

    }
    if(type==6){
      this.subject = 'auction canceled';
      this.message = '';

    }
    if(type==7){
      this.subject = 'Tea Pass Connected';
      this.message = '';

    }
    if(type==8){
      this.subject = 'Honey Added To Your NFT';
      this.message = '';

    }
    if(type==9){
      this.subject = 'Tea Tokens Received';
      this.message = '';

    }
    if(this.email){

      this.send(this.email,this.name,this.subject,this.message);

    }
  }

  async send(email:any,name:any,subject:any,message:any){

    // const request = mailjet.post('send', { version: 'v3.1' }).request({
    //     Messages: [
    //       {
    //         From: {
    //           Email: 'cs@nftea.app',
    //           Name: 'NFTea.app',
    //         },
    //         To: [
    //           {
    //             Email: email,
    //             Name: name,
    //           },
    //         ],
    //         Subject: subject,
    //         //TextPart: 'Greetings from Mailjet!',
    //         HTMLPart:
    //           message,
    //       },
    //     ],
    //   })
    //   request
    //     .then(result => {
    //       console.log(result.body)
    //     })
    //     .catch(err => {
    //       console.log(err.statusCode)
    //     })
  }

}
