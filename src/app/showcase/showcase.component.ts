import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router'
import { SERVICE } from '../service/web3.service';
import Swal from 'sweetalert2'
import { NgxSummernoteModule } from 'ngx-summernote';
const Moralis = require('moralis');
import moment from 'moment';
declare var $: any;
const ABISHOP = require('../../build/teashop/artifacts/abi.json');
const TEASHOP = "0xF29BFeF0122a67616FA64e3D49752067d2367df7";
const axios = require('axios');
import Big from 'big.js';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css']
})
export class ShowcaseComponent implements OnInit {


  userIsConnected:any;
  user:any;
  type:any;
  _auction: FormGroup;
  _delete_auction: FormGroup;
  _bid: FormGroup;
  _buy:FormGroup;
  _shop:FormGroup;
  _report:FormGroup;
  _sugar:FormGroup;
  connected:boolean;
  service:any;
  web3:any;
  NFT:any;
  nft:any;
  nft_id:any;
  nft_owner:any;
  ipfs:any;
  bscscan:any;
  shop:any;
  auction:any;
  showShopApprove:boolean;
  teaBalance:any;
  wallBalance:any;
  market:any;
  BIDDER:any;
  BIDDER_PROFILE:any;
  CREATOR:any;
  CREATOR_PROFILE:any;

  STIR:any;
  STIR_PROFILE:any;
  USER:any;
  BID_TIME:any;
  BREW_VALUE:any;
  BREW_DATE:any;
  WALL_BREW:any;
  HONEY_GIVEN:boolean;
  WALL_BREW_TYPE:any;
  PRICES:any;

  constructor(private formBuilder: FormBuilder, private _service: SERVICE, private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {


    this.service = _service;
    this.createForm();

  }

  async ngOnInit() {

    // const appId = ";
    // const serverUrl = '';
    // Moralis.start({ serverUrl, appId });
    this.user = localStorage.getItem('user');
    this.nft_id = this.route.snapshot.params.nftea;
    this.nft_owner = this.route.snapshot.params.owner;


    //this.userIsConnected = await Moralis.User.current();
    if(this.user){
      this.connected = true;
      //this.user = this.userIsConnected.get('ethAddress');

      //console.log(this.user = this.userIsConnected.get('ethAddress'))
    }else{

      this.user = "0x0000000000000000000000000000000000000000";
    }
    //console.log(this.user);
    this.start();
  }

  async start(){
    //get nftea
    this.NFT = [];
    this.USER = await this.service.GET_PROFILE1(this.user);
    // console.log(this.USER)
    this.service.GET_NFT(this.nft_id,0)
    .then(async(jordi:any)=>{
      let ipfs = await axios.get(jordi.ipfs);
      // console.log();
      ipfs.data.nft_id = this.nft_id;
      ipfs.data.ipfs = jordi.ipfs;
      ipfs.data.partners = jordi.partners;
      ipfs.data.sips = jordi.sips;
      ipfs.data.market = jordi.market;
      this.market = jordi.market;
      this.auction = await this.service.GET_AUCTION(this.nft_owner,this.nft_id);
      if(this.auction.active==2){
        this.CLOSE_AUCTION(this.nft_id,1);
      }else if (this.auction.active==0){

        const _auction = Moralis.Object.extend("auction");
        const _query = new Moralis.Query(_auction);
        _query.equalTo('seller',this.user.toLowerCase());
        _query.equalTo('nft', this.nft_id);
        _query.equalTo('active',1);
        _query.first()
        .then((results:any)=>{
          console.log(results);
          if(results){
            results.set('pending',0);
            results.set('active',0);
            results.save();

          }

        })
      }else if (this.auction.active==1){

        const _auction = Moralis.Object.extend("auction");
        const _query = new Moralis.Query(_auction);
        _query.equalTo('seller',this.user.toLowerCase());
        _query.equalTo('nft', this.nft_id);
        _query.equalTo('pending',1);
        _query.first()
        .then((results:any)=>{
          //console.log(results);
          if(results){
            results.set('pending',0);
            results.set('active',1);
            results.save();
          }


        })
      }
      // console.log(this.auction);
      ipfs.data.auction = this.auction;
      //console.log(auction);
      this.NFT.push(ipfs.data);
      this.NFT = this.NFT[0];
      // console.log(this.NFT);
      //console.log(this.NFT.auction);
      await this.GET_CREATOR();
      await this.GET_SHOP();

      // this.NFT_IDS.push(res.token_id);
      // console.log(this.NFTS);

    })
    // let tokenID = this.service.GET_NFT(this.nft,0)
    // .then((res:any)=>{
    //   this.nft = res;
    //   this.GET_CREATOR();
    //   this.GET_SHOP();
    //   console.log(this.nft);
    // })
    await this.PRICE();
  }
  async PRICE(){
    let price:any = await  this.service.GET_PRICE();
    this.PRICES = price.usdPrice.toFixed(18);
    setInterval(async()=>{

      price = await  this.service.GET_PRICE();
      this.PRICES = price.usdPrice.toFixed(18);
      //console.log(this.PRICES);


    },15000);
  }
  async GET_CREATOR(){
    await  this.service.GET_PROFILE1(this.NFT.creator)
      .then(async(res:any)=>{
        this.CREATOR_PROFILE = res;
        let _creator = this.NFT.creator;
        _creator = _creator.toLowerCase();
        const _uProfile = Moralis.Object.extend("profile");
        const _query = new Moralis.Query(_uProfile);
        _query.equalTo('user',_creator);
        const results = await _query.first();
        this.CREATOR = results;
        // console.log(this.CREATOR);
      })
  }
  async GET_SHOP(){

    this.service.GET_SHOP(0,this.user)
    .then((res:any)=>{
      this.shop = res;
      this.GET_AUCTION();

      // console.log(res)
    })
  }

  async GET_AUCTION(){

      this.GET_SHOP_APPROVAL()
      this.GET_HIGHEST_BIDDER(this.auction.highestBidder)
      this.GET_STIR(this.nft_id)
      this.BREW_VALUE = await this.service.GET_BREW_VALUE(this.nft_id,1);
      this.WALL_BREW = await this.service.GET_WALL_BREW(this.nft_id,2);
      // console.log(this.WALL_BREW);
      this.BREW_DATE = await this.service.GET_BREW_DATE(this.nft_id,1);
      this.HONEY_GIVEN = await this.service.GET_HONEY_GIVEN(this.user,this.nft_id);

  }
  async CLOSE_AUCTION(nft:any, sold:any){
    console.log('closing auction');
    const _auction = Moralis.Object.extend("auction");
    const _query = new Moralis.Query(_auction);
    _query.equalTo('seller',this.user.toLowerCase());
    _query.equalTo('nft', this.nft_id);
    _query.equalTo('active',1);
    _query.first()
    .then(async(res:any)=>{
      //console.log(res)
      res.set('active',0);
      res.set('sold',sold);
      res.set('buyer',this.auction.highestBidder);
      res.save();
    })

  }

  async GET_HIGHEST_BIDDER(_bidder:any){
    // console.log(_bidder);
    let _user = _bidder;
    _bidder = _bidder.toLowerCase();
    const _uProfile = Moralis.Object.extend("profile");
    const _query = new Moralis.Query(_uProfile);
    _query.equalTo('user',_bidder);
    const results = await _query.first();
    this.BIDDER = results;
    // console.log(this.BIDDER.get('user'));

    await  this.service.GET_PROFILE1(_user)
      .then(async(res:any)=>{
        this.BIDDER_PROFILE = res;
        this.BID_TIME = await  this.service.GET_BID_TIME(this.nft_id,this.nft_owner);
        // console.log(this.BID_TIME);
        // console.log(res);
      })
    //console.log(this.BIDDER);
  }
  async GET_STIR(_nft:any){

    await  this.service.GET_STIR(_nft)
      .then(async(res:any)=>{
        this.STIR = res;
        if(this.STIR._stir=='0x0000000000000000000000000000000000000000'){
          this.STIR = {
            _stir:'no one yet',
            _value: 0,
          }
        }else{

          this.service.GET_PROFILE1(this.STIR._stir)
            .then(async(res:any)=>{
              let u = this.STIR._stir;
              const _uProfile = Moralis.Object.extend("profile");
              const _query = new Moralis.Query(_uProfile);
              _query.equalTo('user',this.STIR._stir.toLowerCase());
              const results = await _query.first();
              this.STIR_PROFILE = results;
              // console.log(this.STIR);
            })
        }
        // this.BIDDER_PROFILE = res;
      })
    //console.log(this.BIDDER);
  }
  async GET_SHOP_APPROVAL(){
    this.service.GET_SHOP_APPROVAL(this.user)
    .then(async(jordi:any)=>{
      if(!jordi){
        this.showShopApprove = true
      }
      //console.log(jordi)
    })
  }
  async ACCEPT_BID(){

    // let l = (this.auction.highestBid * 3)/100;
    // let m = this.auction.highestBid-l;
    // console.log(this.auction)
    this.service.SET_ACCEPT_BID(this.user,this.nft_id,this.nft_owner)
    .then(async(jordi:any)=>{
      if(jordi.success){
        this.pop('success', 'bid accepted');
      }else{
        this.pop('error', jordi.msg);

      }
      console.log(jordi)
    })
  }
  async SET_SHOP(){

    if(!this.user){

      Swal.fire({
        title: 'Error!',
        text: 'Connect your wallet 1st',
        icon: 'error',
        confirmButtonText: 'Close'
      })

    }else if(!this._shop.controls.name.value){

      Swal.fire({
        title: 'Error!',
        text: 'What is the name of your shop?',
        icon: 'error',
        confirmButtonText: 'Close'
      })

    }else{

      let taxP = [];
      let taxS = [];
      if(this._shop.controls.taxPartner1.value && this._shop.controls.taxPartner1Sip.value){
        taxP.push(this._shop.controls.taxPartner1.value);
        taxS.push(this._shop.controls.taxPartner1Sip.value)
      }
      if(this._shop.controls.taxPartner2.value && this._shop.controls.taxPartner2Sip.value){
        taxP.push(this._shop.controls.taxPartner2.value);
        taxS.push(this._shop.controls.taxPartner2Sip.value)
      }
      if(this._shop.controls.taxPartner3.value && this._shop.controls.taxPartner3Sip.value){
        taxP.push(this._shop.controls.taxPartner3.value);
        taxS.push(this._shop.controls.taxPartner3Sip.value)
      }
        this.service.SET_SHOP(this.user,this._shop.controls.name.value,taxP,taxS)
        .then((res:any)=>{
          if(res.success){

            const _shop = Moralis.Object.extend("shop");
            const _p = new _shop(this.user);
            _p.save({

              owner:this.user,
              name:this._shop.controls.name.value,
              story:this._shop.controls.address.value,
              city:this._shop.controls.city.value,
              state:this._shop.controls.state.value,
              zip:this._shop.controls.zip.value,
              phone:this._shop.controls.phone.value,
              taxPartners:taxP,
              taxSips:taxS

            }).then(async(res:any)=>{

            Swal.fire({
              title: 'Success!',
              text: 'shop minted',
              icon: 'success',
              confirmButtonText: 'Close'
            })
          });

          }else{

            Swal.fire({
              title: 'Error!',
              text: 'error minting shop, try again',
              icon: 'error',
              confirmButtonText: 'Close'
            })
          }
        });

    }
  }

  async DELETE_SHOP(){
    if(!this.user){

      Swal.fire({
        title: 'Error!',
        text: 'Connect your wallet 1st',
        icon: 'error',
        confirmButtonText: 'Close'
      })

    }else{

      this.service.DELETE_SHOP(this.user,this.shop.id)
      .then((res:any)=>{
        if(res.success){
          this.pop('success', 'shop deleted');

        }else{
          this.pop('error',res.msg);

        }
      })
    }
  }

  async SET_AUCTION(){

    if(!this.user){

      Swal.fire({
        title: 'Error!',
        text: 'Connect your wallet 1st',
        icon: 'error',
        confirmButtonText: 'Close'
      })

    }else if(!this._auction.controls.value.value){

      Swal.fire({
        title: 'Error!',
        text: 'What is the reserve price?',
        icon: 'error',
        confirmButtonText: 'Close'
      })

    }else if(!this._auction.controls.buyNowValue.value && this._auction.controls.buyNowValue.value!=0){

      Swal.fire({
        title: 'Error!',
        text: 'What is the buy now value?',
        icon: 'error',
        confirmButtonText: 'Close'
      })

    }else if(!this._auction.controls.market.value){

      Swal.fire({
        title: 'Error!',
        text: 'What market do you want this in?',
        icon: 'error',
        confirmButtonText: 'Close'
      })

    }else if(this._auction.controls.quantity.value>this.NFT.quantity){

      Swal.fire({
        title: 'Error!',
        text: 'you don\'t have that many nft\'s to auction?',
        icon: 'error',
        confirmButtonText: 'Close'
      })

    }else if (this._auction.controls.buyNowValue.value <= this._auction.controls.value.value && this._auction.controls.buyNowValue.value!=0){
      Swal.fire({
        title: 'Error!',
        text: 'buy now price should not be less than reserve price',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }else{

      let buyNow = this._auction.controls.buyNowValue.value;
      let minPrice = this._auction.controls.value.value;
      // buyNow = new Big(buyNow).toString();
      // minPrice = new Big(minPrice).toString();
      // console.log(this.NFT);
      this.service.SET_AUCTION(this.user,this.nft_id,buyNow,minPrice,this.NFT.partners,this.NFT.sips,this._auction.controls.quantity.value,this.NFT.royalty,this.shop.taxPartners,this.shop.taxSips,this.NFT.creator,this._auction.controls.market.value)
      .then((data:any)=>{
      // console.log(data)
        if(data.success){

          this.pop('success', 'auction created');
          const _auction = Moralis.Object.extend("auction");
          const _query = new Moralis.Query(_auction);
          _query.equalTo('seller',this.user.toLowerCase());
          _query.equalTo('nft', this.nft_id);
          _query.equalTo('active',1);
          _query.first()
          .then((results:any)=>{
            if(!results){

              const _p = new _auction();
              _p.save({

                seller:this.user.toLowerCase(),
                nft:this.nft_id,
                market:this._auction.controls.market.value,
                buyer:this.user.toLowerCase(),
                active:0,
                pending:1,
                sold:0

              }).then(()=>{
                console.log("auction listed");
                //this.pop('success', 'profile created');
              })
            }
          })

        }else{

          this.pop('error', data.msg);

        }
      })

    }
  }
  private SET_BID(){
    let quantity = this._bid.controls.quantity.value;
    let _value = this._bid.controls.value.value*quantity;
    _value = this._bid.controls.value.value*10**9;
    //console.log('value is' + _value);
    this.service.SET_BID(this.user,this.nft_id,_value,1,this.nft_owner)
    .then((res:any)=>{
      if(res.success){
        this.pop('success','bid placed');
      }else{
        this.pop('error', res.msg);
      }
      //console.log(res)
    })
  }
  private SET_SHOP_APPROVAL(){
    //console.log("working")
    this.service.SET_APPROVE(this.user,'TEASHOP')
    .then((res:any)=>{
      if(res.success){
        // console.log(res)
        this.pop('success', 'tea shop approved');

      }else{

        this.pop('error', res.msg);
      }

    })
  }
  private SET_HONEY(){
    if(this.USER.power<5){

      Swal.fire({
        title: 'Error!',
        text: 'your power level is too low to stir',
        icon: 'error',
        confirmButtonText: 'Close'
      })

    }else if(this.HONEY_GIVEN){

      Swal.fire({
        title: 'Error!',
        text: 'you already offered honey',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }else{
      //console.log(this.user);
      this.service.SET_HONEY(this.user,this.nft_id,this.auction.market)
      .then((res:any)=>{
        // console.log(res);
        if(res.success){
          this.pop('success', 'honey added')

        }else{
          this.pop('error', res.msg)

        }

      })
    }

  }
  private GET_BREW_OUT(_token:any){
    if(this.auction.active==1){
      this.pop('error', 'close auction 1st, before withdrawing the brew');
    }else{

      this.service.GET_BREW_OUT(this.user,this.nft_id,_token)
      .then((res:any)=>{
        if(res.success){
          this.pop('success', ' brew created to your balance');
        }else{
          this.pop('error', res.msg);
        }
        //console.log(res);
        //this.pop('success', 'honey added')

      })
    }

  }

  private DATE(_value){
    //console.log(_value);
    return moment(_value*1000).fromNow();
    //return new Date(_value * 1000);
  }
  private BREW(_value){

    if(new Date(_value * 1000) > new Date()){
      return 1;
    }else{
      return 0;
    }
  }
  private setSugarType(_value:any){
    this.WALL_BREW_TYPE = _value.target.value;
    //console.log(_value.target.value);
  }
  private SET_MORE_BREW(){
    let now = moment();
    let time = this._sugar.controls.brewDate.value;
    let _brewDate = moment().add(time, 'months').format('X');
    let _value = this._sugar.controls.value.value;
    // console.log(_brewDate,_value);

    this.service.SET_MORE_BREW(this.user,this.nft_id,this._sugar.controls.type.value,_value,_brewDate)
    .then((res:any)=>{
      if(res.success){
        this.pop('success', 'more tea added to brew');
      }else{
        this.pop('error', res.msg)
      }
    })

      // if(this.WALL_BREW_TYPE==3){
      //   //check if this user owns that nft
      //   this.service.GET_NFT_BALANCE(this.user,this._sugar.controls.nft.value)
      //   .then((res:any)=>{
      //     if(res<this._sugar.controls.value.value || res==0){
      //       this.pop('error','you don\'t own that many nft');
      //     }else{
      //       ///add sugar
      //
      //       this.service.SET_WALL_BREW(this.user,this.nft_id,this._sugar.controls.nft.value,this._sugar.controls.value.value,3)
      //       .then((jordi:any)=>{
      //         console.log(jordi);
      //       })
      //     }
      //   })
      // }else{
      //   if(this.WALL_BREW_TYPE==1){
      //
      //     this.service.GET_TEA_BALANCE(this.user)
      //     .then((res:any)=>{
      //       this.teaBalance = res/1000000000;
      //       if(this.teaBalance<this._sugar.controls.value.value){
      //         this.pop('error','insufficient balance');
      //
      //       }else{
      //         ///add sugar
      //       }
      //     })
      //
      //   }else{
      //
      //     this.service.GET_WALL_BALANCE(this.user)
      //     .then((res:any)=>{
      //       this.wallBalance = res/1000000000;
      //       if(this.wallBalance<this._sugar.controls.value.value){
      //         this.pop('error','insufficient balance');
      //
      //       }else{
      //         //add sugar
      //
      //       }
      //     })
      //
      //     }
      // }
    }
  private DELETE_AUCTION(){
    if(this._delete_auction.controls.confirm.value!='confirm'){
      Swal.fire({
        title: 'Error!',
        text: 'type confirm',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }else{

      this.service.DELETE_AUCTION(this.user,this.nft_id)
      .then(async(res:any)=>{
        if(res.success){
          this.auction = await this.service.GET_AUCTION(this.user,this.nft_id);
          let sold = 0;
          if(this.auction.highestBidder.toLowerCase()!=this.user.toLowerCase()){
            sold = 1;
          }
          const _auction = Moralis.Object.extend("auction");
          const _query = new Moralis.Query(_auction);
          _query.equalTo('seller',this.user.toLowerCase());
          _query.equalTo('nft', this.nft_id);
          _query.equalTo('active',1);
          _query.first()
          .then((results:any)=>{
            results.set('pending',1);
            results.set('buyer',this.auction.highestBidder);
            results.set('sold', sold);
            results.save();

          })
          //console.log(res)
          this.pop('success', 'auction canceled')

        }else{

          this.pop('error', res.msg)

        }

      })

    }

  }
// async listener(){
//     console.log('listening')
//     let web3 = await Moralis.enable();
//     const contract = new web3.eth.Contract(ABISHOP, TEASHOP);
//     contract.events.allEvents()
//     .on('data', (event) => {
//     	console.log(event.event);
//     })
//     .on('error', console.error);
//   }
  private minBid(_value){
    // console.log(_value*10**9);
    _value = _value*10**9;
    return Math.round((_value*.05)+_value)/1000000000;
  }
  private toLower(_value){
    return _value.toLowerCase();
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

  this._auction = this.formBuilder.group({

    value: [''],
    buyNowValue:[''],
    market:[''],
    quantity:['']

  });
  this._bid = this.formBuilder.group({

    value: [''],
    quantity:['']

  });
  this._buy = this.formBuilder.group({

    value: [''],
    quantity:['']

  });
  this._report = this.formBuilder.group({

    reason: [''],
    story:['']

  });
  this._delete_auction = this.formBuilder.group({

    confirm: ['']

  });
  this._sugar = this.formBuilder.group({

    type:[''],
    nft: [''],
    value:[''],
    brewDate:['']

  });
  this._shop = this.formBuilder.group({

    name: [''],
    address:[''],
    city:[''],
    state:[''],
    zip:[''],
    phone:[''],
    taxPartner1:[''],
    taxPartner1Sip:[''],
    taxPartner2:[''],
    taxPartner2Sip:[''],
    taxPartner3:[''],
    taxPartner3Sip:['']

  });

}

}
