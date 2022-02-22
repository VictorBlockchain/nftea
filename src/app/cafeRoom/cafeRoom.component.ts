import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router';
const Moralis = require('moralis');
import { SERVICE } from '../service/web3.service';
import { CAFESERVICE } from '../service/cafe.service';
import Swal from 'sweetalert2'
import moment from 'moment';
import DailyIframe from '@daily-co/daily-js';


@Component({
  selector: 'app-cafeRoom',
  templateUrl: './cafeRoom.component.html',
  styleUrls: ['./cafeRoom.component.css']
})
export class CafeRoomComponent implements OnInit {

  userIsConnected:any;
  user:any;
  room:any;
  service:any;
  ROOM:any;
  AUDIO:any;
  LISTENERS:any;
  CONNECTORS:any;
  TALKERS:any;
  callFrame:any;
  showConnectPass:boolean;
  showDisConnectPass:boolean;
  showRaiseHands:boolean;
  listenerIndex:any;
  IN:any;
  constructor(private formBuilder: FormBuilder, private _service: CAFESERVICE, private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {

    this.service = _service;
    this.showRaiseHands =true;
    //this.createForm();

  }

  async ngOnInit() {

    this.room = this.route.snapshot.params.room
        this.user = localStorage.getItem('user');
        if(this.user){
          this.connected = true;
          this.start();

        }
  }

  async start(){
    // Example: pass configuration properties to createFrame()
    this.callFrame = DailyIframe.createFrame({
      iframeStyle: {
        position: 'fixed',
        border: '1px solid black',
        width: '375px',
        height: '450px',
        right: '1em',
        bottom: '1em',
      },
      showLeaveButton: false,
      videoSource:false,
      showFullscreenButton: true,
    });

    //get room info
    //console.log("getting room");
    this.service.GET_ROOM(this.room)
    .then((res:any)=>{
      //console.log(res);
      this.ROOM = res;
      
      this.GET_AUDIO();

    })
  }

  async GET_AUDIO(){

    try {

      ///console.log("getting audio" + this.room);
      const _uCafe = Moralis.Object.extend("cafe");
      const _query = new Moralis.Query(_uCafe);
      _query.equalTo('room',this.room);
      const results = await _query.first();
      this.AUDIO = results.get('roomURL');
      this.callFrame.join({ url: this.AUDIO });

      setInterval(async()=>{

        this.WHOSLISTENING();
        // this.LISTENERS = await  this.service.GET_LISTENERS(this.room);
        // this.HANDS = await  this.service.GET_HANDS(this.room);
        //console.log(this.LISTENERS);

      },5000)

    } catch (error) {
      console.log('error' + error);
    }

  }

  async CONNECTPASS(){
    this.service.CONNECTPASS(this.user,this.room)
    .then(async(res:any)=>{
      if(res.success){

        this.pop('success', 'connecting...');

      }else{

        this.pop('error', res.msg);

      }
    })
  }

  async DISCONNECTPASS(){
    this.service.SET_DISCONNECT(this.user,this.room,this.listenerIndex)
    .then(async(res:any)=>{
      if(res.success){

        this.pop('success', 'disconnecting...');

      }else{

        this.pop('error', res.msg);

      }
    })
  }

  async RAISEHAND(){
    this.service.SET_HAND_RAISED(this.user,this.room)
    .then(async(res:any)=>{
      if(res.success){

        this.pop('success', 'processing...');

      }else{

        this.pop('error', res.msg);

      }
    })
  }

  async CLOSEROOM(){

    this.callFrame.destroy({ url: this.AUDIO });
    this.service.SET_CLOSE_ROOM(this.user,this.room)
    .then(async(res:any)=>{
      if(res.success){

        this.pop('success', 'processing...');

      }else{

        this.pop('error', res.msg);

      }
    });

  }

  async WHOSLISTENING(){
    this.zone.run(async()=>{

      this.LISTENERS = await this.callFrame.participants({ url: this.AUDIO });
      this.service.GET_LISTENERS(this.room)
      .then(async(res:any)=>{
        this.CONNECTORS = res;
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          console.log(element)
          if(element.toLowerCase()==this.user){

              this.showDisConnectPass = true;
              this.listenerIndex = i
              //console.log(element[i])
              //console.log('show disconnect pass ' + true);
          }else{
            //console.log(element, this.user);
          }
        }


      })
      this.service.GET_HANDS(this.room)
      .then(async(res:any)=>{
        this.TALKERS = res;
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          //console.log(element)
          if(element.toLowerCase()==this.user){

              this.showRaiseHands = false;
              //console.log(element[i])
              //console.log('show disconnect pass ' + true);
          }else{
            //console.log(element, this.user);
          }
        }
      })


      //console.log(this.CONNECTORS);
    })
    //console.log(this.LISTENERS.local);
  }

  async JOIN(){

      this.callFrame.join({ url: this.AUDIO });
  }
  async LEAVE(){

      this.callFrame.leave({ url: this.AUDIO });
  }
  async ADDFAKE(){

      this.callFrame.addFakeParticipant({ url: this.AUDIO });
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
  async getSession(event){


  }
}
