import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router';
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

  userIsConnected:any;
  user:any;
  showCreateRoom:boolean;
  _createRoom: FormGroup;
  service:any;
  AUDIO:any;
  ROOMS:any;

  constructor(private formBuilder: FormBuilder, private _service: CAFESERVICE, private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {

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
    console.log("starting");

    const _uCafe = Moralis.Object.extend("cafe");
    const _query = new Moralis.Query(_uCafe);
    _query.equalTo('owner',this.user);
    _query.equalTo('active',1);
    _query.notEqualTo('roomURL',null);
    const results = await _query.first();
    if(results){
      this.AUDIO = results.get('roomURL');
      //console.log(this.AUDIO);
      if(this.AUDIO){
        this.GETROOMS();
        //console.log(this.AUDIO);

          //this.router.navigate(['/cafe/room/'+results.get('room')]);

      }else{

        await this.service.LISTENER();
        this.GETROOMS();
      }
    }else{
      await this.service.LISTENER();
      this.GETROOMS();

    }



  }
  async GETROOMS(){
    console.log("getting rooms");
    this.ROOMS = []
    const _uCafe = Moralis.Object.extend("cafe");
    const _query = new Moralis.Query(_uCafe);
    _query.equalTo('active',1);
    const results = await _query.find();
    for (let i = 0; i < results.length; i++) {
    const object = results[i];
    let res:any = await this.service.GET_ROOM(object.get('room'));
    this.ROOMS.push(res);
    console.log(this.ROOMS);
  }

    //console.log(this.ROOMS);


  }
  async GETROOM(_value:any){
    console.log(_value);
    let res:any = await this.service.GET_ROOM(_value);
    console.log(res);
    return res;
  }
  async LR(){

    this.service.LAUNCHROOM()
    .subscribe(async(res:any)=>{
      console.log(res);
    })
  }
  async setRoom(){

    if(!this.user){

        Swal.fire({
          title: 'Error!',
          text: 'Connect your wallet to create a collection',
          icon: 'error',
          confirmButtonText: 'Close'
        })

      }else if(!this._createRoom.controls.title.value) {

        Swal.fire({
          title: 'Error!',
          text: 'whats the title?',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      }else if(!this._createRoom.controls.fee.value && this._createRoom.controls.fee.value!=0) {

        Swal.fire({
          title: 'Error!',
          text: 'whats the hand raise fee?',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      }else if(!this._createRoom.controls.details.value) {

        Swal.fire({
          title: 'Error!',
          text: 'whats the details of the room?',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      }else{

        let hosts = [];
        hosts.push(this.user);
        if(this._createRoom.controls.host2.value){
          hosts.push(this._createRoom.controls.host2.value);
        }
        if(this._createRoom.controls.host3.value){
          hosts.push(this._createRoom.controls.host3.value);
        }
        if(this._createRoom.controls.host4.value){
          hosts.push(this._createRoom.controls.host4.value);
        }
        if(this._createRoom.controls.host5.value){
          hosts.push(this._createRoom.controls.host5.value);
        }
        let price:any = await  this.service.GET_PRICE();
        price = price.usdPrice.toFixed(12);
        let _fee = (this._createRoom.controls.fee.value / price).toFixed(0);

        //console.log(_fee);
        this.service.SET_ROOM(this.user,this._createRoom.controls.title.value,_fee,this._createRoom.controls.details.value,this._createRoom.controls.category.value,this._createRoom.controls.nftid.value,hosts)
        .then((res:any)=>{
          if(res.success){

            this.pop('success', 'room created');

          }else{

            this.pop('error', res.msg);
          }
        })

      }
  }

  async getSession(event){

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

    this._createRoom = this.formBuilder.group({

      title: [''],
      fee:[''],
      details:[''],
      category:[''],
      nftid:[''],
      host2:[''],
      host3:[''],
      host4:[''],
      host5:[''],
    });

  }
}
