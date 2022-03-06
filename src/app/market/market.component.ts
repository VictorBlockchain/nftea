import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router'
import { SERVICE } from '../service/web3.service';
import Swal from 'sweetalert2'
import { NgxSummernoteModule } from 'ngx-summernote';
const Moralis = require('moralis');
import { environment } from '../../environments/environment';

declare var $: any;


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {


  userIsConnected:any;
  user:any;
  type:any;
  _profile: FormGroup;
  connected:boolean;
  service:any;
  web3:any;
  PROFILE1:any
  PROFILE2:any

  constructor(private formBuilder: FormBuilder, private _service: SERVICE, private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {


    this.service = _service;
    this.createForm();

  }

  async ngOnInit() {

    this.type = this.route.snapshot.params.type
    const appId = environment.moralisKey;
    const serverUrl = environment.moralisSerer;
    Moralis.start({ serverUrl, appId });

    this.userIsConnected = Moralis.User.current();
    if(this.userIsConnected){
      this.connected = true;
      this.user = localStorage.getItem('user');
      console.log(this.user);

    }
  }

  async start(){

    this.service.getProfile(this.user)
    .then(async(res:any)=>{
        if(res.user == '0x0000000000000000000000000000000000000000'){



        }else{

          // console.log(res);

          this.PROFILE1 = res;
          console.log(this.PROFILE1.avatar);

          const _uProfile = Moralis.Object.extend("profile");
          const _query = new Moralis.Query(_uProfile);
          _query.equalTo('user',this.user);
          const results = await _query.find();
          if(results.length>0){
            //is in database
            for (let i = 0; i < results.length; i++) {
              const object = results[i];
              console.log(object.id);
            }
            console.log('results are in ' + results);

          }else{
            //not in database
            console.log('not in db ' + results);

          }

        }
    })

  }

  async getSession(event){

    }

createForm(){

  this._profile = this.formBuilder.group({

    name: [''],
    email:[''],
    gender:[''],
    country:[''],
    accountType:[''],
    preference:[''],
    story:[''],
    heritage:[''],

  });

}

}
