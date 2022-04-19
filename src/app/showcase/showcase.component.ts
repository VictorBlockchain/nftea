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
import { environment } from '../../environments/environment';
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
  ALBUM:any;
  nft:any;
  nft_id:any;
  wrap_id:any;
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
  COLLECTOR:any;
  SELLER:any;
  COLLECTION:any;
  showPowerUpgrade:boolean;

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
    // console.log(this.nft_id);
    this.nft_owner = this.route.snapshot.params.owner;
    this.COLLECTOR = this.user;

    //this.userIsConnected = await Moralis.User.current();
    if(this.user){
      this.connected = true;
      //this.user = this.userIsConnected.get('ethAddress');

      //console.log(this.user = this.userIsConnected.get('ethAddress'))
    }else{

      this.user = "0x0000000000000000000000000000000000000000";
    }
    //console.log(this.user);
    await this.run();
    //await this.auction();
  }

  async run(){

    this.service.LISTENSHOP();
    this.NFT = [];
    this.SELLER = {};
    this.COLLECTOR = {};
    this.BIDDER = {};
    // let wrappedTo = await this.service.GET_WRAP(this.nft_id);
    let quantityIown;
    let redeemsLeft;
    let burned = 0;
    let quantity;
    this.service.GET_NFT(this.nft_id,0)
    .then(async(jordi:any)=>{
      let url = jordi.ipfs;
      url = url.replace('https://ipfs.moralis.io:2053/ipfs/', 'https://gateway.moralisipfs.com/ipfs/');
      //console.log(url);
      let ipfs = await axios.get(url);
      if(jordi.wrappedTo<1){

        ipfs.data.isCoupon = await this.service.GET_IS_COUPON(this.nft_id);
        burned = await this.service.GET_NFT_BALANCE('0x000000000000000000000000000000000000dEaD',this.nft_id);
        quantity = jordi.quantity - burned;

      }else{

        burned = await this.service.GET_NFT_BALANCE('0x000000000000000000000000000000000000dEaD',jordi.wrappedTo);
        quantity = jordi.quantity;

      }

      quantityIown = await this.service.GET_NFT_BALANCE(this.user,this.nft_id);
      redeemsLeft = await this.service.GET_REDEEM(this.nft_id);

      // console.log(this.nft_id);
      ipfs.data.nft_id = this.nft_id;
      ipfs.data.ipfs = jordi.ipfs;
      ipfs.data.partners = jordi.partners;
      ipfs.data.sips = jordi.sips;
      ipfs.data.market = jordi.market || 0;
      this.market = jordi.market || 0;
      ipfs.data.quantityIown = quantityIown;
      ipfs.data.quantity = quantity;
      ipfs.data.burned = burned;
      ipfs.data.redeemsLeft = redeemsLeft || 0;
      ipfs.data.collection = await this.service.GET_ALBUM(jordi.album);
      this.zone.run(async()=>{
        this.service.GET_AUCTION(this.nft_owner,this.nft_id)
        .then(async(res:any)=>{
          if(res){
            // console.log(res);
            ipfs.data.teapot = res[3];
            ipfs.data.brewDate = res[4];
            ipfs.data.bidAccepted = res[2];
            this.NFT = ipfs.data;
            // console.log(this.NFT.collection);

            this.NFT.shop = await this.service.GET_SHOP(0,this.nft_owner);
            this.NFT.auction = res[0];

            //get seller
            let s:any = await this.service.GET_PROFILE1(this.nft_owner);
            if(s[0]==0){

              this.SELLER.avatar = 'assets/img/avatars/avatar.png';

            }else{

              let s_info:any = this.service.GET_NFT(s[0],0);
              let s_ipfs = await axios.get(s_info.ipfs);
              this.SELLER.avatar = s_ipfs.data.image;

            }
            this.SELLER.power = s[3];
            this.SELLER.heritage = s[2];
            this.SELLER.gender = s[4];

            let c:any = await this.service.GET_PROFILE1(this.user);
            if(s[0]==0){

              this.COLLECTOR.avatar = 'assets/img/avatars/avatar.png';

            }else{
              let c_info:any = this.service.GET_NFT(s[0],0);
              let c_ipfs = await axios.get(c_info.ipfs);
              this.COLLECTOR.avatar = c_ipfs.data.image;
            }
            this.COLLECTOR.heritage = c[2];
            this.COLLECTOR.power = c[3];
            this.COLLECTOR.gender = c[4];

            let b:any = await this.service.GET_PROFILE1(res[0].highestBidder);
            if(b[0]==0){

              this.BIDDER.avatar = 'assets/img/avatars/avatar.png';

            }else{

              let b_info:any = this.service.GET_NFT(s[0],0);
              let b_ipfs = await axios.get(c_info.ipfs);
              this.BIDDER.avatar = c_ipfs.data.image;
              this.BIDDER.collector = res.highestBidder;
            }
          }else{
            console.log('no response');
          }
          this.PRICE();
          this.GET_ALBUM(this.NFT.creator,this.NFT.collection._name);
          if(this.nft_id==1){
            this.checkPowerUp();
          }
          console.log(this.NFT);
        })
      })

    });
  };

  async checkPowerUp(){

    console.log("checking power up")
    this.service.GET_POWER_UP(this.user)
    .then(async(res:any)=>{
      this.showPowerUpgrade = res;
      //console.log(res)
    })
  }

  async SET_POWER_UP(){

    console.log("powering up")
    this.service.SET_POWER_UP(this.user,this.nft_id)
    .then(async(res:any)=>{

      //console.log(res)
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
  async GIFT(){
    if(this._gift.controls.quantity.value>this.NFT.quantity){

      this.pop('error', 'quantity too high');

    }else{

      this.service.SET_GIFT(this.user,this.nft_id,this._gift.controls.to.value,this._gift.controls.quantity.value)
      .then(async(res:any)=>{
        if(res.success){
          this.pop('success', 'gift is on the way');

        }else{
          console.log(JSON.stringify(res.msg))
          this.pop('error', res.msg);

        }
      })
    }
  }
  async PRICE(){
    let price:any = await  this.service.GET_PRICE();
    this.PRICES = price.usdPrice.toFixed(18);
    setInterval(async()=>{

      price = await  this.service.GET_PRICE();
      this.PRICES = price.usdPrice.toFixed(18);
      // console.log(this.PRICES);

    },15000);
  }


  async GET_ALBUM(_collector:any,_name:any){
    console.log(_collector, _name)
    const _uAlbum = Moralis.Object.extend("album");
    const _query = new Moralis.Query(_uAlbum);
    _query.equalTo('user',_collector);
    _query.equalTo('name',_name);
    const results = await _query.first();
    this.ALBUM = results;
    //console.log(results);
    //this.CREATOR = results;
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
  async WRAP(){
    if(this.NFT.quantity==1){

      this.pop('error', 'you cannot wrap one of one nfts');

    }else{

      let metaData:any = new Object();
      metaData.title = this.NFT.title;
      metaData.quantity = 1;
      metaData.story = this.NFT.story;
      metaData.royalty = this.NFT.royalty;
      metaData.sips = this.NFT.sips;
      metaData.attributes = this.NFT.attributes;
      metaData.image = this.NFT.image;
      metaData.creator = this.NFT.user;
      metaData.wrappedTo = this.nft_id;
      metaData.created = this.curday('/');
      metaData.album = this.NFT.album;
      metaData.partners = this.NFT.partners;
      const metaDataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metaData))});
      await metaDataFile.saveIPFS();
      const metaDataURI = await metaDataFile.ipfs();
      let ipfs = metaDataFile._ipfs;

      await  this.service.SET_WRAP(this.user,this.nft_id,metaDataURI,ipfs)
        .then(async(res:any)=>{
          if(res.success){
              this.pop('success', 'nft is being wrapped');
          }else{
            this.pop('error', res.msg);

          }
        })

    }
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

    }else if(!this._auction.controls.value.value && this._auction.controls.value.value!=0){

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

    }else if (this._auction.controls.buyNowValue.value <= this._auction.controls.value.value && this._auction.controls.value.value!=0){

      Swal.fire({
        title: 'Error!',
        text: 'buy now price should not be less than reserve price',
        icon: 'error',
        confirmButtonText: 'Close'
      });

    }else{

      let buyNow = this._auction.controls.buyNowValue.value;
      let minPrice = this._auction.controls.value.value;
      console.log(this.NFT)
      this.service.SET_AUCTION(this.user,this.nft_id,buyNow,minPrice,this.NFT.partners,this.NFT.sips,this._auction.controls.quantity.value,this.NFT.royalty,this.NFT.shop.taxPartners,this.NFT.shop.taxSips,this.NFT.partners[0],this._auction.controls.market.value)
      .then((data:any)=>{
      // console.log(data)
        if(data.success){

          this.pop('success', 'auction being created');

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
  private SET_COUPON(){

    let count = this._coupon.controls.redeemCount.value
    if(count<1){

      Swal.fire({
        title: 'Error!',
        text: 'how many times can this coupon be redeemed?',
        icon: 'error',
        confirmButtonText: 'Close'
      })

    }else{

      this.service.SET_COUPON(this.user,this.nft_id,count)
      .then(async(res:any)=>{
        if(res.success){
          // console.log(res)
          this.pop('success', 'coupon upgrade on the way');

        }else{

          this.pop('error', res.msg);

        }
      })
    }
  }
  private SET_REDEEM(){

    let count = this._redeem.controls.redeemCount.value
    if(count<1){

      Swal.fire({
        title: 'Error!',
        text: 'how many redeems do you want to use?',
        icon: 'error',
        confirmButtonText: 'Close'
      })

    }else{

      this.service.SET_REDEEM(this.user,this.nft_id,count)
      .then(async(res:any)=>{
        if(res.success){
          // console.log(res)
          this.pop('success', 'coupon upgrade on the way');

        }else{

          this.pop('error', res.msg);

        }
      })
    }
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
    if(this.COLLECTOR.power<1000*10**9){

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
      this.service.SET_HONEY(this.user,this.nft_id)
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
  private GET_BREW_OUT(){
    let _token;
    if(this.NFT.auction.active==true){
      this.pop('error', 'close auction 1st, before withdrawing the brew');
    }else{

      if(!this._withdraw.controls.token.value){

        _token = environment.TOKEN;

      }else{

        _token = this._withdraw.controls.token.value;
      }

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
    let now = moment();
    console.log(now.isAfter(_value * 1000));

    // console.log(moment(_value*1000).fromNow());
    return now.isAfter(_value * 1000);
    //return new Date(_value * 1000);
  }
  private BREWDATE(_value){

    return new Date(_value * 1000);

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
    let _brewDate = moment().add(time, 'minutes').format('X');
    let _value = this._sugar.controls.value.value;
    // console.log(_brewDate,_value);

    this.service.SET_MORE_BREW(this.user,this.nft_id,environment.TOKEN,_value,_brewDate)
    .then((res:any)=>{
      if(res.success){
        this.pop('success', 'more tea added to brew');
      }else{
        this.pop('error', res.msg)
      }
    })

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
          // this.auction = await this.service.GET_AUCTION(this.user,this.nft_id);
          // let sold = 0;
          // if(this.auction.highestBidder.toLowerCase()!=this.user.toLowerCase()){
          //   sold = 1;
          // }
          // const _auction = Moralis.Object.extend("auction");
          // const _query = new Moralis.Query(_auction);
          // _query.equalTo('seller',this.user.toLowerCase());
          // _query.equalTo('nft', this.nft_id);
          // _query.equalTo('active',1);
          // _query.first()
          // .then((results:any)=>{
          //   results.set('pending',1);
          //   results.set('buyer',this.auction.highestBidder);
          //   results.set('sold', sold);
          //   results.save();
          //
          // })
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

    value:[''],
    brewDate:['']

  });
  this._coupon = this.formBuilder.group({

    redeemCount:['']

  });
  this._withdraw = this.formBuilder.group({

    token:['']

  });
  this._redeem = this.formBuilder.group({

    redeemCount:['']

  });
  this._gift = this.formBuilder.group({

    quantity:[''],
    to:['']

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
