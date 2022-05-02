import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router'
import Swal from 'sweetalert2'
import { NgxSummernoteModule } from 'ngx-summernote';
const Moralis = require('moralis');
const axios = require('axios');
import moment from 'moment';
declare var $: any;
const NFT = "0xd4dE3Aab3F26AF139b03b93CdEc9f688641cDd8f";
const _auction = Moralis.Object.extend("auction");
import { environment } from '../../environments/environment';
import {SERVICE} from '../service/web3.service';

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
  showEditAvatar:boolean;
  profile:any
  PROFILE1:any
  PROFILE2:any
  editMessage:any
  loading:boolean;
  minting:any;
  ALBUMS:any;
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
  COLLECTOR:any;

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
    this.ALBUMS = [];
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
      // console.log(this.COLLECTOR)
      let avatar = this.COLLECTOR.get('avatar');

      if(avatar>0){

        this.showProfile = true;
        await this.service.GET_ALBUMS(this.user)
        .then(async(res:any)=>{
          this.ALBUMCOUNT = res.length;
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
            await this.service.GET_ALBUM(element)
            .then(async(res:any)=>{
              this.ALBUMS.push(res)
              // console.log(this.ALBUMS)
            })
          }
          this.getNFTSIOWN();
          // console.log(res)
        })


      }else{

        if(this.skip){
          this.showProfile = true;
          this.service.GET_ALBUMS(this.user)
          .then(async(res:any)=>{
            this.ALBUMCOUNT = res.length;
            for (let i = 0; i < res.length; i++) {
              const element = res[i];
              await this.service.GET_ALBUM(element)
              .then(async(res:any)=>{
                this.ALBUMS.push(res)
                console.log(this.ALBUMS)
              })
            }

            // console.log('get albums is own ' + res);
            this.getNFTSIOWN();
            // console.log('skipping to my lou')

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
        // console.log(element);

        let ipfs:any;
        let url = element.token_uri;
        if(url){
          // console.log(element);
          url = url.replace('https://ipfs.moralis.io:2053/ipfs/', 'https://gateway.moralisipfs.com/ipfs/');

        }else{

          let jordi:any = await this.service.GET_NFT(element.token_id,0);
          url = jordi.ipfs.replace('https://ipfs.moralis.io:2053/ipfs/', 'https://gateway.moralisipfs.com/ipfs/');
        }

           ipfs = await axios.get(url);

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
    console.log('getting my auctions');
    this.AUCTIONS = [];
    let NFTEA:any;
    NFTEA = [];
    let DATA:any;
    DATA = [];
    this.service.GET_MY_AUCTIONS(this.user)
    .then(async(res:any)=>{
      if(res.length>0){
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          //console.log(element)

          DATA.auction = await this.service.GET_AUCTION_ID(element);
        //  console.log(DATA.auction)
          if(DATA.auction.status==1){
            this.AUCTIONCOUNT+=1;
            let r:any = await this.service.GET_NFT(DATA.auction.nft,'null');
            let url = r.ipfs;
            if(url){
              // console.log(element);
              url = url.replace('https://ipfs.moralis.io:2053/ipfs/', 'https://gateway.moralisipfs.com/ipfs/');
            }
            let ipfs = await axios.get(url);
            DATA.nft = ipfs.data
            this.AUCTIONS.push(DATA);
          }
        }

      }else{

      }

    })
  }

  async getMyAlbums(){

  }

  // async getNFTSCreatedByMe(){
  //   //console.log('getting nfts');
  //   await this.service.GET_NFTS(this.user)
  //   .then(async(res:any)=>{
  //
  //     this.NFTCOUNT = res.length;
  //     // console.log(res);
  //     if(this.NFTCOUNT>0){
  //       // console.log(res);
  //       let NFTS:any = res;
  //       this.NFTEAS = [];
  //
  //       NFTS.forEach(element => {
  //         //console.log('album is ' + element);
  //         this.service.GET_NFTEA(element)
  //         .then(async(res:any)=>{
  //
  //           let _vault = await this.service.GET_TEAPOT(element);
  //           let ipfs:any = await axios.get(res.ipfs);
  //           this.NFTEAS.push({ipfs:ipfs.data,teapot:_vault,id:element});
  //           this.loading = false;
  //           //console.log(ipfs.data.image);
  //         });
  //       });
  //     }
  //
  //   })
  // }

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
        gender:this._profile.controls.gender.value,
        avatar:0,
        cover:0,
        verified:0,
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




// async GET_USER_AUCTIONS(){
//   console.log('getting auctions');
//   this.AUCTIONS = [];
//   const _query = new Moralis.Query(_auction);
//   _query.equalTo('seller',this.user.toLowerCase());
//   _query.equalTo('active',1);
//   const results = await _query.find();
//   if(results){
//     this.AUCTIONCOUNT = results.length;
//   }else{
//     this.AUCTIONCOUNT = 0;
//   }
//   // console.log(results);
//     for (let i = 0; i < results.length; i++) {
//
//         const object = results[i];
//         this.service.GET_NFT(object.get('nft'),0)
//         .then(async(jordi:any)=>{
//           // console.log('nft is ' + object.get('nft'));
//           let ipfs = await axios.get(jordi.ipfs);
//           ipfs.data.nft_id = object.get('nft');
//           let auction = await this.service.GET_AUCTION(this.user,object.get('nft'));
//           ipfs.data.auction = auction;
//           this.AUCTIONS.push(ipfs.data);
//           // console.log(this.AUCTIONS);
//         })
//       }
//       this.cd.detectChanges();
// }
// async GET_MINTING(){
//
//   const _MINTING = Moralis.Object.extend("BscNFTOwnersPending");
//   const _query = new Moralis.Query(_MINTING);
//   _query.equalTo('owner_of',this.user);
//   this.minting = await _query.first();
//   //console.log(this.minting);
// }
async editProfile(){

  if(!this.user){

    Swal.fire({
      title: 'Error!',
      text: 'Connect your wallet 1st',
      icon: 'error',
      confirmButtonText: 'Close'
    })

  }else{

        ///update database
          const _uProfile = Moralis.Object.extend("profile");
          let _query = new Moralis.Query(_uProfile);
          _query.equalTo('user',this.user);
          _query.first()
          .then(async(results:any)=>{
            // console.log(results.get('user'))
            if(results.get('user')){
              results.set('active',1);
              results.set('pending',0);
              results.set('email', this._editProfile.controls.email.value || this.COLLECTOR.get('email'));
              results.set('name', this._editProfile.controls.name.value || this.COLLECTOR.get('name'));
              results.set('accountType', this._editProfile.controls.accountType.value || this.COLLECTOR.get('accountType'));
              results.set('preference', this._editProfile.controls.preference.value || this.COLLECTOR.get('preference'));
              results.set('story', this._editProfile.controls.story.value || this.COLLECTOR.get('story'));
              results.set('heritage', this._editProfile.controls.heritage.value || this.COLLECTOR.get('heritage'));
              results.set('gender', this._editProfile.controls.gender.value || this.COLLECTOR.get('gender'));
              results.save()
              .then(async(res)=>{
                if(res){
                  console.log(res.get('name'))
                  this.pop('success','profile updated');

                }
              })

            }
          })
      }
}

async SETAVATAR(){

  let avatar = this._editProfile.controls.avatar.value;
  //let cover = this._editProfile.controls.cover.value;
  this.service.GET_NFT_BALANCE(this.user,avatar)
  .then((res:any)=>{
    if(res<1){
      this.pop('error', 'you don\'t own this avatar nft or you have it listed for sale');
    }else{
      this.service.SET_AVATAR(this.user,avatar,this.COLLECTOR.get('heritage'),this.COLLECTOR.get('gender'))
      .then(async(res:any)=>{
        if(res.success){
          this.pop('success', 'updating avatar')
        }else{
          this.pop('error', res.msg)

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
    gender:[''],
    realName:[''],
    accountType:[''],
    preference:[''],
    story:[''],
    heritage:[''],

  });

}

}
