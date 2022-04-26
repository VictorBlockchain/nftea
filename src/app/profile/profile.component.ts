import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router'
import { SERVICE } from '../service/web3.service';
import Swal from 'sweetalert2'
import { NgxSummernoteModule } from 'ngx-summernote';
const Moralis = require('moralis');
const axios = require('axios');
import moment from 'moment';
declare var $: any;
const NFT = "0xd4dE3Aab3F26AF139b03b93CdEc9f688641cDd8f";
const _auction = Moralis.Object.extend("auction");
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  userIsConnected:any;
  user:any;
  api:any;
  _profile: FormGroup;
  _editProfile:FormGroup;
  connected:boolean;
  service:any;
  web3:any;
  showCreateProfile:boolean;
  showEditProfile:boolean;
  showProfile:boolean;
  showEditBlockchain:boolean;
  profile:any
  PROFILE1:any
  PROFILE2:any
  editMessage:any
  loading:boolean;
  minting:any;
  ALBUM:any;
  NFTEAS:any;
  AUCTIONS:any;
  hasProfile1:boolean;
  hasProfile2:boolean;
  ALBUMCOUNT = 0;
  NFTCOUNT = 0;
  AUCTIONCOUNT = 0;
  POWER:any;
  showGoBuyAvatar:boolean;
  skip:boolean;

  constructor(private formBuilder: FormBuilder, private _service: SERVICE, private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {


    this.service = _service;
    this.loading = true;
    this.createForm();

  }

  async ngOnInit() {

    this.profile = this.route.snapshot.params.user
    this.user = localStorage.getItem('user');
    const appId = environment.moralisKey;
    const serverUrl = environment.moralisSerer;
    Moralis.start({ serverUrl, appId });

    if(this.user){
      this.connected = true;
      if(this.profile==this.user){
        console.log('same guy');
        this.start();

      }else{
        this.user = this.profile;
        this.start()
          console.log('different guy');
      }
    }
  }

  async start(){
    // console.log(this.skip)
    let power:any = await this.service.GET_PROFILE1(this.user);
    this.POWER = power[3];
    // console.log(power)
    const _uProfile = Moralis.Object.extend("profile");
    const _query = new Moralis.Query(_uProfile);
    _query.equalTo('user',this.user);
    const results = await _query.first();
    this.COLLECTOR = results;
    if(!this.COLLECTOR){
      console.log('no collector')
      this.showCreateProfile = true;
      //console.log(this.COLLECTOR)

    }else{
      //console.log(this.COLLECTOR)
      let avatar = this.COLLECTOR.get('avatar');

      if(avatar>0){

        this.showProfile = true;
        await this.service.GET_ALBUMS(this.user)
        .then((res:any)=>{
          this.ALBUMCOUNT = res.length;
          this.getNFTSIOWN();
          // console.log(res)
        })


      }else{

        if(this.skip){
          this.showProfile = true;
          await this.service.GET_ALBUMS(this.user)
          .then((res:any)=>{
            this.ALBUMCOUNT = res.length;
            this.getNFTSIOWN();
            console.log('skipping to my lou')

          })

        }else{

          this.showGoBuyAvatar = true;
          this.showProfile = false;
          console.log('not skipped')


        }

      }

    }

  }
  async getNFTSIOWN(){
    console.log('getting nfts I own')
    this.service.GET_USER_NFTS(this.user)
    .then(async(res:any)=>{
      // console.log(res)
      this.NFTCOUNT = res.msg.length;
      let loop:any = res.msg;
      this.NFTEAS = [];
      if(loop.length<1){
        this.loading = false;

      }
      for (let i = 0; i < loop.length; i++) {
        const element = loop[i];
        let ipfs:any;
          if(element.token_uri){

           ipfs = await axios.get(element.token_uri);

          }else{

            let NFTDETAILS = await this.service.GET_NFT(element.token_id,null);
            //console.log(NFTDETAILS.ipfs)
            ipfs = await axios.get(NFTDETAILS.ipfs);
            //ipfs = NFTDETAILS.ipfs;

          }

            let isWrapped = await this.service.GET_WRAP(element.token_id);
            let q;
            if(isWrapped>0){
              ipfs.data.quantity = 1;
            }
            let _vault = await this.service.GET_TEAPOT(element.token_id);
            this.NFTEAS.push({ipfs:ipfs.data,teapot:_vault,id:element.token_id,wrappedTo:isWrapped});
            this.loading = false;

          // console.log(this.NFTEAS);
      }
      this.getMyAuctions()
    })

  }

  async getMyAuctions(){

    this.AUCTIONS = [];
    let NFTEA =[];
    let DATA= [];
    this.service.GET_MY_AUCTIONS(this.user)
    .then(async(res:any)=>{
      if(res.length>0){
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          console.log(element)

          DATA.auction = await this.service.GET_AUCTION_ID(element);
        //  console.log(DATA.auction)
          if(DATA.auction.active==true){
            this.AUCTIONCOUNT+=1;
            let r:any = await this.service.GET_NFT(DATA.auction.nft,'null');
            let ipfs = await axios.get(r.ipfs);
            DATA.nft = ipfs.data
            this.AUCTIONS.push(DATA);
          }
        }

      }else{

      }

    })
  }

  async getNFTSCreatedByMe(){
    //console.log('getting nfts');
    await this.service.GET_NFTS(this.user)
    .then(async(res:any)=>{

      this.NFTCOUNT = res.length;
      // console.log(res);
      if(this.NFTCOUNT>0){
        // console.log(res);
        let NFTS:any = res;
        this.NFTEAS = [];

        NFTS.forEach(element => {
          //console.log('album is ' + element);
          this.service.GET_NFTEA(element)
          .then(async(res:any)=>{

            let _vault = await this.service.GET_TEAPOT(element);
            let ipfs:any = await axios.get(res.ipfs);
            this.NFTEAS.push({ipfs:ipfs.data,teapot:_vault,id:element});
            this.loading = false;
            //console.log(ipfs.data.image);
          });
        });
      }

    })
  }

  async setProfile(){

    if(!this._profile.controls.name.value){

      Swal.fire({
        title: 'Error!',
        text: 'enter your cool user name',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }else if(!this._profile.controls.email.value){

      Swal.fire({
        title: 'Error!',
        text: 'enter your email',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }else if(!this._profile.controls.accountType.value){

      Swal.fire({
        title: 'Error!',
        text: 'are you a collector or creator?',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }else if(!this._profile.controls.preference.value){

      Swal.fire({
        title: 'Error!',
        text: 'what is your art preference?',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }else if(!this._profile.controls.story.value){

      Swal.fire({
        title: 'Error!',
        text: 'what is your story?',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }else{

      const _uProfile = Moralis.Object.extend("profile");
      const _p = new _uProfile(this._profile.controls.email.value);

      _p.save({

        name:this._profile.controls.name.value,
        email:this._profile.controls.email.value,
        accountType:this._profile.controls.accountType.value,
        preference:this._profile.controls.preference.value,
        story:this._profile.controls.story.value,
        heritage:this._profile.controls.heritage.value,
        avatar:0,
        cover:0,
        user:this.user

      }).then(()=>{

        this.pop('success', 'profile created, buy an avatar or cover nft next');
        this.showEditProfile = false;
        this.showCreateProfile = false;
        this.showGoBuyAvatar = true;
        //this.start();
      })
    }

  }

  // async getProfile2(){
  //   try {
  //
  //     console.log("geting profile 2");
  //     const _uProfile = Moralis.Object.extend("profile");
  //     const _query = new Moralis.Query(_uProfile);
  //     _query.equalTo('user',this.user);
  //     const results = await _query.first();
  //     this.PROFILE2 = results;
  //     // this.loading = false;
  //     //console.log(this.PROFILE2);
  //
  //     if(this.PROFILE2 && this.PROFILE2.get('user')){
  //       //user is in the database
  //       //console.log("really in db");
  //       this.hasProfile2 = true;
  //       if(this.PROFILE1.user != '0x0000000000000000000000000000000000000000'){
  //         ///user ins on the blockchain
  //         this.showEditProfile = false;
  //         this.showCreateProfile = false;
  //         this.showProfile = true;
  //         this.editMessage = "your profile was stored in the blockchain but not on our database, try again please";
  //         this.hasProfile1 = true;
  //         this.loadProfile();
  //         //console.log("user is in the db and in the blockchain" + this.PROFILE1);
  //
  //       }else{
  //
  //         ///user is not in the blockchain
  //         this.showCreateProfile = true;
  //         this.showEditProfile = true;
  //         this.showEditBlockchain = true;
  //         this.editMessage = "your profile was stored in our database but not on on the blockchain, try again please";
  //         //console.log("user is in the db and not in the blockchain here");
  //
  //       }
  //     }else{
  //       console.log("not in db");
  //       //user is not in the database
  //       if(this.PROFILE1.user != '0x0000000000000000000000000000000000000000'){
  //         ///user is in the blockchain
  //         this.showProfile = false;
  //         this.showCreateProfile = true;
  //         this.showEditBlockchain = false;
  //         this.showEditProfile = true;
  //         this.editMessage = "your profile was stored on the blockchain, but not in our database try again please";
  //         console.log("user is not in db but is on blockchain");
  //
  //       }else{
  //
  //         //user is on the blockchain
  //         this.showEditProfile = false;
  //         this.showCreateProfile = true;
  //         this.editMessage = "your profile was stored in the database but not on the blockchain, try again please";
  //         console.log("user is not in db and not on the blockchain");
  //
  //       }
  //       //console.log('in db' + this.PROFILE2.user)
  //     }
  //   } catch (error) {
  //
  //   }
  // }

async loadProfile(){

  console.log("geting collections and things");
  this.service.GET_PROFILE1(this.user)
  .then(async(res:any)=>{
    let ALBUMS:any = res.albums;
    // console.log(res);
    this.COLLECTIONCOUNT = ALBUMS.length;
    this.COLLECTION = [];

    ALBUMS.forEach(element => {
      //console.log('album is ' + element);
      this.service.GET_ALBUM(element)
      .then((res:any)=>{

        this.COLLECTION.push({id:element,name:res.name});
        //console.log(this.COLLECTION);

      })
    });
  })
//   const _uCollection = Moralis.Object.extend("collection");
//   const _query = new Moralis.Query(_uCollection);
//   _query.equalTo('user',this.user);
//   const results = await _query.find();
//   for (let i = 0; i < results.length; i++) {
//   const object = results[i];
//   //console.log(object.get('nfteas'))
// }
//   this.COLLECTION = results;
//   if(this.COLLECTION){
//     this.COLLECTIONCOUNT = this.COLLECTION.length;
//   }else{
//     this.COLLECTIONCOUNT = 0;
//   }
  //console.log(this.COLLECTION);
  this.loading = false;

}
async GET_USER_NFTS(){
  console.log("getting nfts");
  this.NFTS =[];
  let koin;
  let ALBUMNFTS = []
  const _NFTS = Moralis.Object.extend("BscNFTOwners");
  const _query = new Moralis.Query(_NFTS);
  _query.equalTo('owner_of',this.user.toLowerCase());
  const results = await _query.find();
  if(results){
    this.NFTCOUNT = results.length;
  }else{
    this.NFTCOUNT = 0;
  }
  // console.log(results);
    for (let i = 0; i < results.length; i++) {
    const object = results[i];
    // console.log(object.get('token_address'));
    if(object.get('token_address')==NFT.toLowerCase()){
      //console.log(object.get('token_id'));


              this.service.GET_NFT(object.get('token_id'),0)
              .then(async(jordi:any)=>{
                // console.log(jordi);

                let ipfs = await axios.get(jordi.ipfs);
                ipfs.data.nft_id = object.get('token_id');
                //console.log(ipfs.data)
                let COLL:any = this.COLLECTION.find(id=>id.id==ipfs.data.collection);
                ALBUMNFTS.push(ipfs.data)
                COLL.nfts = ALBUMNFTS;
                //console.log(this.COLLECTION);

                let auction = await this.service.GET_AUCTION(this.user,object.get('token_id'));
                console.log(auction)
                // if(auction.market!=4){
                //   koin = 1;
                // }else{
                //   koin = 2;
                // }
                let brewTea = await this.service.GET_BREW_VALUE(object.get('token_id'));
                let brewDate = await this.service.GET_BREW_DATE(object.get('token_id'),koin);
                brewDate = moment(brewDate*1000).fromNow();
                ipfs.data.auction = auction;
                ipfs.data.brewTea = brewTea;
                ipfs.data.dateTea = brewDate;
                this.NFTS.push(ipfs.data);
                //console.log(this.NFTS);
                this.loading = false;
              })

    }else{
      //console.log(object.get('token_address'));
    }
    //console.log(object.get('token_address'));
    //alert(object.id + ' - ' + object.get('ownerName'));
  }

}

async GET_USER_AUCTIONS(){
  console.log('getting auctions');
  this.AUCTIONS = [];
  const _query = new Moralis.Query(_auction);
  _query.equalTo('seller',this.user.toLowerCase());
  _query.equalTo('active',1);
  const results = await _query.find();
  if(results){
    this.AUCTIONCOUNT = results.length;
  }else{
    this.AUCTIONCOUNT = 0;
  }
  // console.log(results);
    for (let i = 0; i < results.length; i++) {

        const object = results[i];
        this.service.GET_NFT(object.get('nft'),0)
        .then(async(jordi:any)=>{
          // console.log('nft is ' + object.get('nft'));
          let ipfs = await axios.get(jordi.ipfs);
          ipfs.data.nft_id = object.get('nft');
          let auction = await this.service.GET_AUCTION(this.user,object.get('nft'));
          ipfs.data.auction = auction;
          this.AUCTIONS.push(ipfs.data);
          // console.log(this.AUCTIONS);
        })
      }
      this.cd.detectChanges();
}
async GET_MINTING(){

  const _MINTING = Moralis.Object.extend("BscNFTOwnersPending");
  const _query = new Moralis.Query(_MINTING);
  _query.equalTo('owner_of',this.user);
  this.minting = await _query.first();
  //console.log(this.minting);
}
async editProfile(){
  console.log("editing");
  if(!this.user){

    Swal.fire({
      title: 'Error!',
      text: 'Connect your wallet 1st',
      icon: 'error',
      confirmButtonText: 'Close'
    })

  }else{

    if(this.PROFILE2 && this.PROFILE2.length<1){
      ///store in db
      if(this.profile!=this.user){

        Swal.fire({
          title: 'Error!',
          text: 'You cannot edit this profile',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      }else if(!this._profile.controls.name.value){

        Swal.fire({
          title: 'Error!',
          text: 'enter your cool user name',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      }else if(!this._profile.controls.email.value){

        Swal.fire({
          title: 'Error!',
          text: 'enter your email',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      }else if(!this._profile.controls.accountType.value){

        Swal.fire({
          title: 'Error!',
          text: 'are you a collector or creator?',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      }else if(!this._profile.controls.preference.value){

        Swal.fire({
          title: 'Error!',
          text: 'what is your art preference?',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      }else if(!this._profile.controls.story.value){

        Swal.fire({
          title: 'Error!',
          text: 'what is your story?',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      }else{

        const _uProfile = Moralis.Object.extend("profile");
        const _p = new _uProfile(this._profile.controls.email.value);

        _p.save({

          name:this._profile.controls.name.value,
          email:this._profile.controls.email.value,
          accountType:this._profile.controls.accountType.value,
          preference:this._profile.controls.preference.value,
          story:this._profile.controls.story.value,
          user:this.user

        }).then(()=>{

          this.pop('success', 'profile created');
        })

      }

    }else{

      if(!this.PROFILE1.user){
        ///send to blockchain
        this.service.SET_PROFILE(this.user)
        .then((res:any)=>{
          if(res){
            this.pop('success', 'profile created');
          }else{
            this.pop('error','error creating your profile');
          }
        })
      }else{

        ///update database
        const _uProfile = Moralis.Object.extend("profile");
        const _query = new Moralis.Query(_uProfile);
        _query.equalTo('user',this.user);
        const results = await _query.first();
        //console.log(results);
        if(results){
          results.email = this._profile.controls.email.value;
          results.name = this._profile.controls.name.value;
          results.accountType = this._profile.controls.accountType.value;
          results.preference = this._profile.controls.preference.value;
          results.story = this._profile.controls.story.value;
          results.heritage = this._profile.controls.heritage.value;
          _query.save(results)
          .then((res:any)=>{
            if(res.length>0){
              this.pop('success','profile updated');

            }else{
              this.pop('error', 'error creating your profile');
            }
          })
        }else{

          const _uProfile = Moralis.Object.extend("profile");
          const _p = new _uProfile(this._profile.controls.email.value);

          _p.save({

            name:this._profile.controls.name.value,
            email:this._profile.controls.email.value,
            accountType:this._profile.controls.accountType.value,
            preference:this._profile.controls.preference.value,
            story:this._profile.controls.story.value,
            heritage:this._profile.controls.heritage.value,
            user:this.user

          }).then(()=>{

            this.pop('success', 'profile created');
          })
        }

      }

    }
  }
}

async editBlockchainProfile(){
  const _uProfile = Moralis.Object.extend("profile");
  const _query = new Moralis.Query(_uProfile);
  _query.equalTo('user',this.user);
  const results = await _query.first();
  let heritage = results.get('heritage');
// console.log(heritage);
  this.service.SET_PROFILE(this.user,heritage)
  .then((res:any)=>{
    if(res.success){
      this.pop('success', 'profile added to blockchain')
    }else{
      this.pop('error', res.msg)
      // console.log(res);

    }
    // if(res){
    //   this.pop('success', 'profile created');
    // }else{
    //   this.pop('error','error creating your profile');
    // }
  })
}

async SET_PROFILE(){
  console.log("creating");

  if(!this.user){

    Swal.fire({
      title: 'Error!',
      text: 'Connect your wallet 1st',
      icon: 'error',
      confirmButtonText: 'Close'
    })

  }else if(this.profile!=this.user){

    Swal.fire({
      title: 'Error!',
      text: 'You cannot edit this profile',
      icon: 'error',
      confirmButtonText: 'Close'
    })
  }else if(!this._profile.controls.name.value){

    Swal.fire({
      title: 'Error!',
      text: 'enter your cool user name',
      icon: 'error',
      confirmButtonText: 'Close'
    })
  }else if(!this._profile.controls.email.value){

    Swal.fire({
      title: 'Error!',
      text: 'enter your email',
      icon: 'error',
      confirmButtonText: 'Close'
    })
  }else if(!this._profile.controls.accountType.value){

    Swal.fire({
      title: 'Error!',
      text: 'are you a collector or creator?',
      icon: 'error',
      confirmButtonText: 'Close'
    })
  }else if(!this._profile.controls.preference.value){

    Swal.fire({
      title: 'Error!',
      text: 'what is your art preference?',
      icon: 'error',
      confirmButtonText: 'Close'
    })
  }else if(!this._profile.controls.story.value){

    Swal.fire({
      title: 'Error!',
      text: 'what is your story?',
      icon: 'error',
      confirmButtonText: 'Close'
    })
  }else{

    const _uProfile = Moralis.Object.extend("profile");
    const _query = new Moralis.Query(_uProfile);
    _query.equalTo('email',this._profile.controls.email.value)
    const results = await _query.find();

    if(results.length>0){
      ///email in use
      this.pop('error','that email is in use');

    }else{
      _query.equalTo('name',this._profile.controls.name.value);
      const results = await _query.find();
      if(results>0){
        //name in use
        this.pop('error','user name taken');

      }else{

        const _p = new _uProfile(this._profile.controls.email.value);

        _p.save({

          name:this._profile.controls.name.value,
          email:this._profile.controls.email.value,
          accountType:this._profile.controls.accountType.value,
          preference:this._profile.controls.preference.value,
          story:this._profile.controls.story.value,
          user:this.user,
          realName:this._profile.controls.realName.value,
          heritage:this._profile.controls.heritage.value

        })
        .then((res:any)=>{
          // console.log(res);
          console.log("sending to back");
          this.service.SET_PROFILE(this.user,this._profile.controls.heritage.value)
          .then((res:any)=>{
            if(res){
              this.pop('success', 'profile created');
            }else{
              this.pop('error','error creating your profile');
            }
          })

        },(error)=>{
          this.pop('error', error);
        })

      }
    }

  }
}

async SETAVATAR(){

  let avatar = this._editProfile.controls.avatar.value;
  let cover = this._editProfile.controls.cover.value;
  this.service.GET_NFT_BALANCE(this.user,avatar)
  .then((res:any)=>{
    if(res<1){
      this.pop('error', 'you don\'t own this avatar nft or you have it listed for sale');
    }else{
      this.service.GET_NFT_BALANCE(this.user,cover)
      .then((res:any)=>{
        if(res<1){
          this.pop('error', 'you don\'t own this cover nft or you have it listed for sale');

        }else{
          this.service.SET_AVATAR()
        }
      })
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

  this._profile = this.formBuilder.group({

    name: [''],
    email:[''],
    gender:[''],
    realName:[''],
    accountType:[''],
    preference:[''],
    story:[''],
    heritage:[''],

  });

  this._editProfile = this.formBuilder.group({

    name: [''],
    email:[''],
    avatar:[''],
    cover:[''],
    country:[''],
    preference:[''],
    story:[''],
    heritage:[''],

  });

}

}
