import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router'
import { SERVICE } from '../service/web3.service';
import Swal from 'sweetalert2'
import { NgxSummernoteModule } from 'ngx-summernote';
const Moralis = require('moralis');
declare var $: any;

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css']
})
export class MintComponent implements OnInit {

  userIsConnected:any;
  connected:boolean;
  user:any;
  _createCollection: FormGroup;
  _createNFT:FormGroup;
  imageURI:any;
  imageName:any;
  imageURL:any;
  showApproval:boolean;
  showEnableToken:boolean;
  showEnableNFT:boolean;
  showEnableShop:boolean;
  showEnableWallToken:boolean;
  creator:any
  CREATOR:any;
  CREATOR_PROFILE:any;
  IDS:any;
  COLLECTIONID:any;
  COLLECTION:any;
  service:any;

  constructor(private formBuilder: FormBuilder, private _service: SERVICE, private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {


    this.service = _service;

    this.showApproval = false;
    this.createForm();

  }
  async ngOnInit() {

    this.creator = this.route.snapshot.params.user
    this.userIsConnected = Moralis.User.current();
    if(this.userIsConnected){
      this.connected = true;
      this.user = localStorage.getItem('user');
      this.start();
      this.GET_IDS();
      //console.log(this.user);
    }
  }

  async start(){

    console.log('starting');

    let approve1 = await this.service.GET_APPROVAL(this.user,1)
    if(approve1==0){
      console.log(approve1 + ' 1')

      this.showApproval = true
      this.showEnableToken = true;
    }else{
      console.log(approve1 + ' 1')
      this.showEnableToken = false;

    }
    let approve2 = await this.service.GET_APPROVAL(this.user,2)
    if(!approve2){
      this.showApproval = true
      this.showEnableNFT = true;

    }else{

      this.showEnableNFT = false;

    }
    let approve3 = await this.service.GET_APPROVAL(this.user,3)
    if(!approve3){
      this.showApproval = true
      this.showEnableShop = true;

    }else{
      console.log(approve3)
      this.showEnableShop = false;

    }
    let approve4 = await this.service.GET_APPROVAL(this.user,4)
    if(approve4==0){
      this.showApproval = true
      this.showEnableWallToken = true;

    }else{
      console.log(approve4)
      this.showEnableWallToken = false;

    }
    console.log(this.showApproval);
    if(!this.showApproval){

      this.service.GET_PROFILE1(this.creator)
      .then(async(res:any)=>{
        if(res.user == '0x0000000000000000000000000000000000000000'){

          this.pop('error', 'lets create your profile 1st');

        }else{

          this.CREATOR = res;
            //get users collections
            const _profile = Moralis.Object.extend("profile");
            const _query = new Moralis.Query(_profile);
            _query.equalTo('user',this.creator.toLowerCase());
            const result = await _query.first();
            this.CREATOR_PROFILE = result;
            console.log(this.CREATOR_PROFILE);

        }
      })
    }
  }


  async GET_IDS(){
    console.log("working")
    this.service.GET_IDS(this.creator)
    .then(async(res:any)=>{
      //console.log(res)
      this.IDS = [];
      for (let i = 0; i < res.length; i++) {
        let id = res[i];
        let obj:any = new Object();
        obj.id = id;
        obj.name;
        obj.image;
        this.IDS.push(obj);
        //console.log(id)

      }
      //console.log(res);
    })
  }
  async upload(event:any){

    for (let i = 0; i < event.target.files.length; i++) {
      const element = event.target.files[i];

        const imageFile = new Moralis.File(element.name,element)
        await imageFile.saveIPFS();
        this.imageURI= await imageFile.ipfs();
        this.zone.run(()=>{
          let nft:any = this.IDS[i];
          nft.image = this.imageURI;
          nft.name = element.name;
        })
        this.cd.markForCheck();
        console.log(this.IDS[i]);
      }

}

  async onReaderLoad(event){
    //alert(event.target.result);
    var obj = JSON.parse(event.target.result);
    alert(obj);
}
  private setCollectonID(collectionID:any){
    this.COLLECTIONID = collectionID;
    console.log('id is ' + this.COLLECTIONID);
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
  createForm(){

    this._createCollection = this.formBuilder.group({

      name: [''],
      story:[''],
      category:['']

    });
    this._createNFT = this.formBuilder.group({

      title: [''],
      quantity: [''],
      story:[''],
      royalty:[''],
      split1:[''],
      split1Value:[''],
      split2:[''],
      split2Value:[''],
      split3:[''],
      split3Value:[''],
      prop1:[''],
      prop1Value:[''],
      prop2:[''],
      prop2Value:[''],
      prop3:[''],
      prop3Value:[''],
      prop4:[''],
      prop4Value:[''],
      prop5:[''],
      prop5Value:[''],
      prop6:[''],
      prop6Value:['']

    });

  }

}
