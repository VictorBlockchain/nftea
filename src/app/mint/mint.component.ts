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
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css']
})
export class MintComponent implements OnInit {

  userIsConnected:any;
  connected:boolean;
  user:any;
  _nftSettings: FormGroup;
  _nftStory:FormGroup;
  _mintPass:FormGroup;
  _settings:FormGroup;
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
  ALBUMID:any;
  ALBUM:any;
  service:any;
  _creatorSplit;

  constructor(private formBuilder: FormBuilder, private _service: SERVICE, private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {


    this.service = _service;

    this.showApproval = false;
    this.createForm();

  }
  async ngOnInit() {

    this.creator = this.route.snapshot.params.user
    const appId = environment.moralisKey;
    const serverUrl = environment.moralisSerer;
    Moralis.start({ serverUrl, appId });
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
            this.GET_ALBUMS();
            console.log(this.CREATOR_PROFILE);

        }
      })
    }
  }

  async GET_ALBUMS(){

    await this.service.GET_ALBUMS(this.creator)
     .then((res:any)=>{

       if(res.length>0){
         // console.log(res);
         let ALBUMS:any = res;
         this.ALBUM = [];

         ALBUMS.forEach(element => {
           //console.log('album is ' + element);
           this.service.GET_ALBUM(element)
           .then((res:any)=>{

             this.ALBUM.push({id:element,name:res._name, category:res._category, media:res._media});
             console.log(this.ALBUM);
           })
         });
       }
     })
  }

  async GET_IDS(){

    console.log("working")
    this.service.GET_IDS(this.creator)
    .then(async(res:any)=>{
      // console.log(res)
      this.IDS = [];
      for (let i = 0; i < res.length; i++) {
        let id = res[i];
        let obj:any = new Object();
        obj.id = id;
        obj.name;
        obj.image;
        this.IDS.push(obj);

        const _reserve = Moralis.Object.extend("reserve");
        const _query = new Moralis.Query(_reserve);
        _query.equalTo('user',this.creator.toLowerCase());
        _query.equalTo('nftid', id);
        const result = await _query.first();
        if(!result){

          const _r = new _reserve(id);
          _r.set('nftid',id),
          _r.set('user',this.creator),
          _r.set('name',null),
          _r.set('image',null),
          _r.set('story',null),
          _r.set('prop1', null),
          _r.set('prop1Value', null),
          _r.set('prop2', null),
          _r.set('prop2Value', null),
          _r.set('prop3', null),
          _r.set('prop3Value', null),
          _r.set('prop4', null),
          _r.set('prop4Value', null),
          _r.set('prop5', null),
          _r.set('prop5Value', null),
          _r.set('prop6', null),
          _r.set('prop6Value', null),
          _r.set('rarity',null)
          _r.set('index',i)
          _r.save()
          .then((res:any)=>{
            // console.log(res)
          })

        }else{
          //
        }
      }
      //console.log(res);
    })
  }
  async setStory(){
    if(this._nftStory.controls.nftid.value<1){
      this.pop('error', 'whats the nft id?');
    }else if(!this._nftStory.controls.story.value){
      this.pop('error', 'whats the story for this nft?');
    }else{

      const _reserve = Moralis.Object.extend("reserve");
      const _query = new Moralis.Query(_reserve);
      _query.equalTo('user',this.creator.toLowerCase());
      _query.equalTo('nftid', this._nftStory.controls.nftid.value);
      const result = await _query.first();
      // console.log(result.get('nftid'));
      if(result.get('nftid')==this._nftStory.controls.nftid.value){

        result.set('story', this._nftStory.controls.story.value);
        result.set('prop1', this._nftStory.controls.prop1.value);
        result.set('prop1Value', this._nftStory.controls.prop1Value.value);
        result.set('prop2', this._nftStory.controls.prop2.value);
        result.set('prop2Value', this._nftStory.controls.prop2Value.value);
        result.set('prop3', this._nftStory.controls.prop3.value);
        result.set('prop3Value', this._nftStory.controls.prop3Value.value);
        result.set('prop4', this._nftStory.controls.prop4.value);
        result.set('prop4Value', this._nftStory.controls.prop4Value.value);
        result.set('prop5', this._nftStory.controls.prop5.value);
        result.set('prop5Value',  this._nftStory.controls.prop5Value.value);
        result.set('prop6', this._nftStory.controls.prop6.value);
        result.set('prop6Value', this._nftStory.controls.prop6Value.value);
        result.set('rarity',this._nftStory.controls.rarity.value)
        result.save();
        this.pop('success', 'story set');

      }else{

        this.pop('error', 'no nft');

      }

    }
  }
  async setMintPass(){

    if(this._mintPass.controls.nftid.value<1){

      this.pop('error', 'whats the mint pass nft id?');

    }else if(!this._mintPass.controls.album.value){

      this.pop('error', 'what album is this minting to?');

    }else{

      const _regen = Moralis.Object.extend("regenerative");
      const _query = new Moralis.Query(_regen);
      _query.equalTo('user',this.creator.toLowerCase());
      _query.equalTo('album', this._mintPass.controls.album.value);
      _query.first()
      .then((result:any)=>{
        console.log(result, this._mintPass.controls.album.value)
        if(result){

          result.set('mintpass', this._mintPass.controls.nftid.value);
          result.save();
          this.pop('success', 'mint pass set');
        }else{
          this.pop('error', 'adjust settings 1st');
        }
      })
    }
  }

  async setSettings(){

    let _totalSplit = (this._settings.controls.split1Value.value + this._settings.controls.split1Value.value) + this._settings.controls.split3Value.value;
    this._creatorSplit = 100 - _totalSplit;
    let sips = [];
    sips.push({partner:this.creator,sip:this._creatorSplit});
    let pass = 1;
    if(this._settings.controls.title.value<1){
      this.pop('error', 'whats the title?');
      pass = 0;
    }
    if(this._settings.controls.album.value<1 && pass>0){
      this.pop('error', 'whats the album?');
      pass = 0;
    }
    if(!this._settings.controls.royalty.value && this._settings.controls.royalty.value!=0 && pass>0){

      this.pop('error', 'what is the royalty you are collecting')
      pass = 0;
    }
    if(this._settings.controls.split1.value && this._settings.controls.split1Value.value){
      sips.push({partner:this._settings.controls.split1.value,sip:this._settings.controls.split1Value.value});
    }
    if(this._settings.controls.split2.value && this._settings.controls.split2Value.value){
      sips.push({partner:this._settings.controls.split2.value,sip:this._settings.controls.split2Value.value});
    }
    if(this._settings.controls.split3.value && this._settings.controls.split3Value.value){
      sips.push({partner:this._settings.controls.split3.value,sip:this._settings.controls.split3Value.value});
    }
    if(pass>0){

      const _regen = Moralis.Object.extend("regenerative");
      const _query = new Moralis.Query(_regen);
      _query.equalTo('user',this.creator.toLowerCase());
      _query.equalTo('album', this._settings.controls.album.value);
      const result = await _query.first();
      if(result){
        result.set('title', this._settings.controls.title.value);
        result.set('split1', this._settings.controls.split1.value);
        result.set('split1Value',this._settings.controls.split1Value.value);
        result.set('split2', this._settings.controls.split2.value);
        result.set('split2Value',this._settings.controls.split2Value.value);
        result.set('split3', this._settings.controls.split3.value);
        result.set('split3Value',this._settings.controls.split3Value.value);
        result.save()
        .then(()=>{
          this.pop('success', 'settings updated');
        })

      }else{

        const _r = new _regen();
        _r.set('user',this.creator),
        _r.set('album',this._settings.controls.album.value),
        _r.set('title',this._settings.controls.title.value),
        _r.set('split1', this._settings.controls.split1.value);
        _r.set('split1Value',this._settings.controls.split1Value.value);
        _r.set('split2', this._settings.controls.split2.value);
        _r.set('split2Value',this._settings.controls.split2Value.value);
        _r.set('split3', this._settings.controls.split3.value);
        _r.set('split3Value',this._settings.controls.split3Value.value);
        _r.save()
        .then((res:any)=>{

          this.pop('success', 'settings added');

          // console.log(res)
        })
      }

    }

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

        const _reserve = Moralis.Object.extend("reserve");
        const _query = new Moralis.Query(_reserve);
        _query.equalTo('user',this.creator.toLowerCase());
        _query.equalTo('nftid', this.IDS[i]);
        _query.first()
        .then((res:any)=>{
          if(res){

            res.set('image', this.imageURI);
            res.set('imagename', element.name);
            res.save();

          }
        })

        // console.log(this.IDS[i]);
      }

}

  async onReaderLoad(event){
    //alert(event.target.result);
    var obj = JSON.parse(event.target.result);
    alert(obj);
}
  private setCollectonID(collectionID:any){
    this.ALBUMID = collectionID;
    console.log('id is ' + this.ALBUMID);
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
  async getSession(event:any){

    if(event){
      this.user = event
      // alert(this.user);
      this.connected = true;

    }else{
      this.connected = false;
      this.user = null;
    }
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

    this._mintPass = this.formBuilder.group({

      album:[''],
      nftid:['']

    });
    this._nftSettings = this.formBuilder.group({

      name: [''],
      story:[''],
      category:['']

    });
    this._nftStory = this.formBuilder.group({

      nftid: [''],
      story:[''],
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
      prop6Value:[''],
      rarity:['']

    });

    this._settings = this.formBuilder.group({

      title: [''],
      royalty:[''],
      split1:[''],
      split1Value:[''],
      split2:[''],
      split2Value:[''],
      split3:[''],
      split3Value:[''],
      album:[''],

    });

  }

}
