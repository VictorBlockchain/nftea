import { Injectable } from '@angular/core';
declare var require;

const ABITOKEN = require('../../build/token/abi.json');
const ABINFTEA = require('../../build/nft/abi.json');
const ABITEASHOP = require('../../build/teashop/abi.json');
const ABITEAPASS = require('../../build/teapass/abi.json');
const ABITEAPOT = require('../../build/teapot/abi.json');
const ABIHONEY = require('../../build/honey/abi.json');
// const ABIWALLTOKEN = require('../../build/token/wallabi.json');
const Moralis = require('moralis');

import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from '../../environments/environment';

import {writeJsonFile} from 'write-json-file';
import Big from 'big.js';
const BN = require('bn.js');
const TOKEN = environment.TOKEN;
const NFTEA = environment.NFTEA;
const TEASHOP = environment.TEASHOP;
const TEAPASS = environment.TEAPASS;
const TEAPOT = environment.TEAPOT;
const HONEY = environment.HONEY;
const HANDS = environment.HANDS;
const ESPORTS = environment.ESPORTS;
// const contract = "0x0F173887b83bAE28B6F506004DCB1bb087191dbf";
declare var ethereum: any


@Injectable({
  providedIn: 'root',
})
export class SERVICE {

  isMobile: any;
  web3:any;
  user:any;

  constructor(private deviceService: DeviceDetectorService) {
    //this.storage = localStorage
    this.isMobile = this.deviceService.isMobile();

    this.GET_WEB3();
  }

async GET_WEB3(): Promise<any>{

        this.user = localStorage.getItem('user');
        if(this.isMobile && !this.web3 ){
           this.web3 = await Moralis.enableWeb3({provider:'walletconnect',chain: environment.CHAIN});
        }else if(!this.isMobile && !this.web3){
           this.web3 = await Moralis.enableWeb3();
        }
        let res = {success:true};
        return res;

  }

  public GET_PROFILE1(_user:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("in the back getting profile 1 " + NFT);
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABITEAPASS, TEAPASS);
        let result = await contract.methods.getProfile(_user).call();
        // console.log(result);
        resolve(result);

      } catch (error) {
        console.log(error)
      }
    })
  }
  public GET_ALBUMS(_user:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("in the back getting profile 1 " + NFT);
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
        let result = await contract.methods.getCollectorAlbums(_user).call();
        resolve(result);

      } catch (error) {
        console.log(error)
      }
    })
  }
  public GET_ALBUM(_album: any): Promise<any> {
    return new Promise(async (resolve, reject) => {

      await this.GET_WEB3();
      const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
      let result = await contract.methods.getAlBUM(_album).call();
      resolve(result);
    })
  }
  public GET_NFTS(_user:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("in the back getting profile 1 " + NFT);
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
        let result = await contract.methods.getCollectorNfts(_user).call();
        //console.log(result);
        resolve(result);

      } catch (error) {
        console.log(error)
      }
    })
  }
  public GET_NFTEA(_nft: any): Promise<any> {
    return new Promise(async (resolve, reject) => {

      await this.GET_WEB3();
      const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
      let result = await contract.methods.GET_NFT(_nft).call();
      resolve(result);
    })
  }
  public GET_TEAPOT(_nft: any): Promise<any> {
    return new Promise(async (resolve, reject) => {

      await this.GET_WEB3();
      const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
      let result = await contract.methods._N2_V(_nft).call();
      resolve(result);
    })
  }
  public SET_WRAP(_user: any,_nft:any,_uri,ipfs): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "wrap",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_nft'
          },{
            type: 'bytes',
            name: 'data'
          },{
            type: 'string',
            name: '_ipfs'
          }]
        }, [_nft,this.web3.utils.asciiToHex(_uri),ipfs])
        const txt = await this.web3.eth.sendTransaction({
          from:_user,
          to: NFTEA,
          gas: 3000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          console.log(hash)

              resolve({ success: true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
          }).on('error', console.error);

      } catch (error) {
        resolve({success:false,msg:error});
      }
    })
  }
  public SET_IDS(_user: any,_amount:any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {
        console.log("reserving ids");
        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "RESERVEIDS",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_amount'
          }
          ]
        }, [_amount])
        const txt = await this.web3.eth.sendTransaction({
          from:_user,
          to:NFTEA,
          gas: 1000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          console.log(hash)

              resolve({ success: true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
          }).on('error', console.error);
        // const transactionHash = await ethereum.request({
        //   method: 'eth_sendTransaction',
        //   gas: 1000000,
        //   params: [
        //     {
        //       from: _user,
        //       to: NFTEA,
        //       data: encodedFunction
        //     },
        //   ],
        // }).then(async (res) => {
        //   resolve({ success: true, msg: res });
        // });

      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public GET_IDS(_creator:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("in the back " + user);
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
        let result = await contract.methods.GET_RESERVEIDS(_creator).call();
        // console.log(result);
        resolve(result);

      } catch (error) {

      }
    })
  }
  public GET_SHIT_BALANCE(_address:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("in the back " + user);
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABITOKEN, TOKEN);
        let result = await contract.methods.balanceOf(_address).call();
        // console.log(result);
        resolve(result);

      } catch (error) {

      }
    })
  }
  public GET_VAULT_BALANCE(_token:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("in the back " + user);
        await this.GET_WEB3();

            let contract;
            let contract1;
            let brew;
            let result;
            if(_token==1){

              contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
              brew = await contract.methods.brewPot(TOKEN).call();
              result = await contract.methods.GET_HONEYPOT_VALUE(TOKEN).call();

            }else{

              // contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
              // brew = await contract.methods.brewPot(WALLTOKEN).call();
              // result = await contract.methods.GET_HONEYPOT_VALUE(WALLTOKEN).call();
            }

            // console.log(result);
            let res:any = {success:true,brew:brew,vault:result};
            resolve(res);


      } catch (error) {
        //alert(error)
        console.log(error);
      }
    })
  }
  public SET_PROFILE(user: any,heritage:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log(user, heritage);
        await this.GET_WEB3();
        // console.log(web3);
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SET_PROFILE",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: 'avatar'
          }, {
            type: 'uint256',
            name: 'cover'
          },{
            type:'uint256',
            name:'heritage'
          }
          ]
        }, [0, 0,heritage])
        const txt = await this.web3.eth.sendTransaction({
          from:user,
          to:TEAPASS,
          gas: 1000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          console.log(hash)

          resolve({success:true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
        }).on('error', (error)=>{
          resolve({success:false, msg: error.error });

        });
        // const transactionHash = await ethereum.request({
        //   method: 'eth_sendTransaction',
        //   gas: 1000000,
        //   params: [
        //     {
        //       from: user,
        //       to: NFTEA,
        //       data: encodedFunction
        //     },
        //   ],
        // }).then((res: any) => {
        //
        //   resolve(res);
        // })
      } catch (error) {
        resolve(error);
      }
    })
  }
  public SET_ACCEPT_BID(_user: any,_nft:any,_owner:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "END_AUCTION",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_nft'
          }, {
            type: 'uint256',
            name: '_type'
          },{
            type:'address',
            name:'_host'
          }
          ]
        }, [_nft, 1,_owner])
        const txt = await this.web3.eth.sendTransaction({
          from:_user,
          to:environment.TEASHOP,
          gas: 1000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          console.log(hash)

              resolve({ success: true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
          }).on('error', console.error);

      } catch (error) {
        resolve({success:false,msg:error});
      }
    })
  }

  public GET_BREW_OUT(_user: any,_nft:any,_token:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      console.log(_token)
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "WITHDRAW",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_nft'
          }, {
            type: 'address',
            name: '_token'
          }
          ]
        }, [_nft, _token])
        const txt = await this.web3.eth.sendTransaction({
          from:_user,
          to:TEAPOT,
          gas: 1000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          console.log(hash)

              resolve({ success: true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
          }).on('error', console.error);
        // const transactionHash = await ethereum.request({
        //   method: 'eth_sendTransaction',
        //   gas: 1000000,
        //   params: [
        //     {
        //       from: _user,
        //       to: NFTEA,
        //       data: encodedFunction
        //     },
        //   ],
        // }).then((res: any) => {
        //
        //   resolve({success:true,msg:res});
        // })
      } catch (error) {
        resolve({success:false,msg:error});
      }
    })
  }

  public GET_AUCTION(_user:any,_nft:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("gettting auction " + _nft, _user);
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABITEASHOP, TEASHOP);
        let result = await contract.methods.GET_AUCTION(_nft,_user).call();
        //console.log(result);
        resolve(result);

      } catch (error) {
        //alert(error.error);
        console.log(error);
      }
    })
  }
  public GET_BID_TIME(_nft:any,_owner:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("gettting bid time");
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABITEASHOP, TEASHOP);
        let result = await contract.methods.nftToBidTime(_nft,_owner).call();
        // console.log(result);
        resolve(result);

      } catch (error) {

      }
    })
  }
  public GET_BREW_VALUE(_nft:any,_token:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("gettting brew value");
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
        let result = await contract.methods.NFTtoTokenBrewing(_nft,_token).call();
        // console.log(result);
        resolve(result);

      } catch (error) {

      }
    })
  }
  public GET_WALL_BREW(_nft:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("gettting brew value");
        // await this.GET_WEB3();
        // const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
        // let result = await contract.methods.NFTtoTokenBrewing(_nft,WALLTOKEN).call();
        // // console.log(result);
        // resolve(result);

      } catch (error) {

      }
    })
  }
  public SET_GIFT(_user: any,_nft:any,_to:any,_quantity:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(_nft);
        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "GIFT",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_nft'
          }, {
            type: 'address',
            name: '_to'
          },{
            type:'uint256',
            name:'_quantity'
          }]
        }, [_nft, _to,_quantity])
        const txt = await this.web3.eth.sendTransaction({
          from:_user,
          to:NFTEA,
          gas: 1000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

              resolve({ success: true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
          }).on('error', console.error);
        // const transactionHash = await ethereum.request({
        //   method: 'eth_sendTransaction',
        //   gas: 1000000,
        //   params: [
        //     {
        //       from: _user,
        //       to: NFTEA,
        //       data: encodedFunction
        //     },
        //   ],
        // }).then((res: any) => {
        //
        //   resolve({success:true,msg:res});
        // })
      } catch (error) {
        resolve({success:false,msg:error});
      }
    })
  }
  public GET_BREW_DATE(_nft:any,_token:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("gettting brew value");
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
        let result = await contract.methods.NFTtoTokenToBrewDate(_nft,_token).call();
        // console.log(result);
        resolve(result);

      } catch (error) {

      }
    })
  }

  public SET_SHOP(user: any, name: any, taxParnters: any, taxSips: any): Promise<any> {
    // console.log(user, TEASHOP)
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("setting shoping");
        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SET_SHOP",
          type: "function",
          inputs: [{
            type: 'string',
            name: 'name'
          },{
            type: 'address[]',
            name: 'taxParnters'
          },{
            type: 'uint256[]',
            name: 'taxSips'
          }]
      }, [name,taxParnters,taxSips])
      const txt = await this.web3.eth.sendTransaction({
        from:user,
        to:environment.TEASHOP,
        gas: 1000000,
        data:encodedFunction
      }).on('transactionHash',(hash)=>{

        console.log(hash)

            resolve({ success: true, msg: hash });
            // console.log(hash)
        })
        .on('receipt',(receipt)=>{
           console.log(receipt)
        })
        .on('confirmation',(confirmationNumber, receipt)=>
        {
        //console.log(confirmationNumber, receipt)
        }).on('error', console.error);
        // const transactionHash = await ethereum.request({
        //   method: 'eth_sendTransaction',
        //   gas: 1000000,
        //   params: [
        //     {
        //       from: user,
        //       to: TEASHOP,
        //       data: encodedFunction
        //     },
        //   ],
        // }).then(async (res) => {
        //   resolve({ success: true, msg: res });
        // });

      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public DELETE_SHOP(user: any, _shop: any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {
        console.log("deleting shop");
        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "DELETE_SHOP",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_shop'
          }
          ]
        }, [_shop])
        const txt = await this.web3.eth.sendTransaction({
          from:user,
          to:environment.TEASHOP,
          gas: 1000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          console.log(hash)

              resolve({ success: true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
          }).on('error', console.error);
        // const transactionHash = await ethereum.request({
        //   method: 'eth_sendTransaction',
        //   gas: 1000000,
        //   params: [
        //     {
        //       from: user,
        //       to: TEASHOP,
        //       data: encodedFunction
        //     },
        //   ],
        // }).then(async (res) => {
        //   resolve({ success: true, msg: res });
        // });

      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public DELETE_AUCTION(_user: any, _nft: any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {
        console.log("deleting auction" + _user, _nft);
        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "END_AUCTION",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_nft'
          },{
            type:'uint256',
            name:'_type'
          },{
            type:'address',
            name:'_host'
          }
          ]
        }, [_nft,1,_user])
        const txt = await this.web3.eth.sendTransaction({
          from:_user,
          to:environment.TEASHOP,
          gas: 1000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          //console.log(hash)

              resolve({ success: true, msg: 'done' });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
             const _auction = Moralis.Object.extend("auction");
             const _query = new Moralis.Query(_auction);
             _query.equalTo('seller',_user);
             _query.equalTo('nft', _nft);
             _query.equalTo('pending',1);
             _query.first()
             .then((results)=>{
               if(results){
                 console.log('updating auction')

                     //console.log(res)
                     results.set('active',0);
                     results.set('pending',0);
                     results.save();
                     // _query.save(res);
                     // console.log('auction canceled');
                 }
               });
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
          }).on('error', console.error);
        // const transactionHash = await ethereum.request({
        //   method: 'eth_sendTransaction',
        //   gas: 1000000,
        //   params: [
        //     {
        //       from: _user,
        //       to: TEASHOP,
        //       data: encodedFunction
        //     },
        //   ],
        // }).then(async (res) => {
        //   resolve({ success: true, msg: res });
        // });

      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public GET_SHOP(id:any, user: any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("shoping");
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABITEASHOP, TEASHOP);
        let result = await contract.methods.GET_SHOP(id, user).call();
        // console.log(result);
        resolve(result);

      } catch (error) {

      }
    })
  }
  public GET_HONEY_GIVEN(user: any,nft:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("getting honey given");
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
        let result = await contract.methods.stirToNFT(user,nft).call();
        // console.log(result);
        resolve(result);

      } catch (error) {

      }
    })
  }
  public GET_HONEY_POT(_token:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("getting honey value");
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
        let result = await contract.methods.GET_HONEYPOT_VALUE(_token).call();
        // console.log(result);
        resolve(result);

      } catch (error) {
        console.log(error);
      }
    })
  }
  public SET_COUPON(_user: any,_nft:any,_count:any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {
        console.log("setting coupon" + _nft);
        let _token;
        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "setCoupon",
          type: "function",
          inputs: [{
            type:'uint256',
            name:'_nft'
          },{
            type:'uint256',
            name:'_redeemCount'
          }]
        }, [_nft,_count])
        const txt = await this.web3.eth.sendTransaction({
          from:_user,
          to:NFTEA,
          gas: 1000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          console.log(hash)

              resolve({ success: true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
          }).on('error', console.error);


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public GET_IS_COUPON(_nft:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("getting honey value");
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
        let result = await contract.methods._Nis_coupon(_nft).call();

        // console.log(result);
        resolve(result);

      } catch (error) {
        console.log(error);
      }
    })
  }
  public SET_REDEEM(_user: any,_nft:any,_count:any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {
        console.log("redeeming coupon" + _nft);
        let _token;
        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "redeemCoupon",
          type: "function",
          inputs: [{
            type:'uint256',
            name:'_nft'
          },{
            type:'uint256',
            name:'_redeemCount'
          }]
        }, [_nft,_count])
        const txt = await this.web3.eth.sendTransaction({
          from:_user,
          to:NFTEA,
          gas: 1000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          console.log(hash)

              resolve({ success: true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
          }).on('error', console.error);


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public GET_REDEEM(_wnft:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("getting honey value");
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
        let result = await contract.methods._WN2_redeemCount(_wnft).call();

        // console.log(result);
        resolve(result);

      } catch (error) {
        console.log(error);
      }
    })
  }
  public SET_HONEY(_user: any,_nft:any,_market:any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {
        console.log("adding honey" + _user);
        let _token;
        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SET_HONEY",
          type: "function",
          inputs: [{
            type:'uint256',
            name:'_nft'
          },{
            type:'address',
            name:'_token'
          }]
        }, [_nft,_token])
        const txt = await this.web3.eth.sendTransaction({
          from:_user,
          to:NFTEA,
          gas: 1000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          console.log(hash)

              resolve({ success: true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
          }).on('error', console.error);


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public SET_BID(_user: any,_nft:any, _value:any,_quantity:any,_owner:any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {
        console.log("setting bid " + _value);
        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SET_BID",
          type: "function",
          inputs: [{
            type:'uint256',
            name:'_nft'
          },{
            type:'address',
            name:'_host'
          },{
            type:'uint256',
            name:"_value"
          },{
            type:'uint256',
            name:'_quantity'
          }]
        }, [_nft,_owner,_value,_quantity])
        const txt = await this.web3.eth.sendTransaction({
          from:_user,
          to:environment.TEASHOP,
          gas: 1000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          console.log(hash)

              resolve({ success: true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
          }).on('error', console.error);
        // const transactionHash = await ethereum.request({
        //   method: 'eth_sendTransaction',
        //   gas: 1000000,
        //   params: [
        //     {
        //       from: _user,
        //       to: TEASHOP,
        //       data: encodedFunction
        //     },
        //   ],
        // }).then(async (res) => {
        //   resolve({ success: true, msg: res });
        // });

      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public SET_MORE_BREW(_user: any,_nft:any,_type:any,_value:any,_brewDate:any): Promise<any> {
    //console.log(_nft,_type,_value,_brewDate);
    return new Promise(async (resolve, reject) => {
      try {
        console.log("adding more brew" + _value);
        await this.GET_WEB3();
        let m:any = new Big(_value);
        m = m.toFixed(0);
        //m = Number(m*10**9);
        // new Big(1000000000000).toString();
        // _value = new Big(_value*m).toString();
        // _value = parseFloat(_value*m).toFixed(0);
        // console.log(Number(_value));
        //_value = _value+'000000000';
        _value = this.web3.utils.toWei(m.toString(), 'nanoether');
        let _token;

        console.log(_value);
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SET_MORE_BREW",
          type: "function",
          inputs: [{
            type:'uint256',
            name:'_nft'
          },{
            type:'uint256',
            name:"_value"
          },{
            type:'address',
            name:'_token'
          },{
            type:'uint256',
            name:'_time'
          }
        ]
      }, [_nft,_value,_token,_brewDate])
      const txt = await this.web3.eth.sendTransaction({
        from:_user,
        to:NFTEA,
        gas: 1000000,
        data:encodedFunction
      }).on('transactionHash',(hash)=>{

        console.log(hash)

            resolve({ success: true, msg: hash });
            // console.log(hash)
        })
        .on('receipt',(receipt)=>{
           console.log(receipt)
        })
        .on('confirmation',(confirmationNumber, receipt)=>
        {
        //console.log(confirmationNumber, receipt)
        }).on('error', console.error);
        // const transactionHash = await ethereum.request({
        //   method: 'eth_sendTransaction',
        //   gas: 1000000,
        //   params: [
        //     {
        //       from: _user,
        //       to: NFTEA,
        //       data: encodedFunction
        //     },
        //   ],
        // }).then(async (res) => {
        //   resolve({ success: true, msg: res });
        // });

      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public SET_ALBUM(_user:any,_name:any): Promise<any>{
    return new Promise(async(resolve,reject)=>{
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "setAlBUM",
          type: "function",
          inputs: [{
            type:'string',
            name:'name'
          }]
        }, [_name])
        const txt = await this.web3.eth.sendTransaction({
          from:_user,
          to:NFTEA,
          gas: 2000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          console.log(hash)

              resolve({ success: true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
          }).on('error', console.error);
        // const transactionHash = await ethereum.request({
        //   method: 'eth_sendTransaction',
        //   gas: 1000000,
        //   params: [
        //     {
        //       from: _user,
        //       to: NFTEA,
        //       data: encodedFunction
        //     },
        //   ],
        // }).then(async (res) => {
        //   resolve({ success: true, msg: res });
        // },(error)=>{
        //   console.log(error);
        //   resolve({ success: false, msg:error.error });
        // });
      } catch (error) {

      }
    })
  }

  public MINT(_uri, address, quantity, ipfs, royalty, partners, sips, story, collection,creator,useThisId,mintPass): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        //console.log(collection, creator, useThisId, mintPass);
        //console.log(address, NFTEA);
        let canWrap = false;
        if(quantity>1){
          canWrap = true;
        }
        await this.GET_WEB3();
        //console.log(this.web3.utils.asciiToHex(_uri));
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "mint",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: 'amount'
          }, {
            type: 'bytes',
            name: 'data'
          }, {
            type: 'string',
            name: 'ipfs'
          }, {
            type: 'uint256',
            name: 'royalty'
          }, {
            type: 'address[]',
            name: 'partners'
          }, {
            type: 'uint256[]',
            name: 'sips'
          }, {
            type: 'string',
            name: 'story'
          },{
            type: 'uint256',
            name: 'collection'

          },{
            type:"address",
            name:"_creator"
          },{
            type:"uint256",
            name:'useThisId'
          },{
            type:"uint256",
            name:"_mintPass"
          },{
            type:'bool',
            name:'_canWrap'
          }
          ]
        }, [quantity, this.web3.utils.asciiToHex(_uri), ipfs, royalty, partners, sips, story,collection,creator,useThisId,mintPass,canWrap])
        const txt = await this.web3.eth.sendTransaction({
          from:address,
          to: NFTEA,
          gas: 3000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          console.log(hash)

              resolve({ success: true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
          }).on('error', console.error);
        // const transactionHash = await ethereum.request({
        //   method: 'eth_sendTransaction',
        //   gas: 1000000,
        //   params: [
        //     {
        //       from: address,
        //       to: NFTEA,
        //       data: encodedFunction
        //     },
        //   ],
        // }).then(async (res) => {
        //   resolve({ success: true, msg: res });
        // });
        // Handle the result
        //resolve(transactionHash);
        //console.log(transactionHash);

        //   let web3 = await Moralis.enable({provider:'walletconnect',chain: environment.CHAIN})
        //   //const URI:any = this.web3.utils.asciiToHex(_uri)
        //   const encodedFunction= this.web3.eth.abi.encodeFunctionCall({
        //     name:"mint",
        //     type:"function",
        //     inputs:[{
        //       type:'address',
        //       name:'account'
        //     },{
        //       type:'uint256',
        //       name:'amount'
        //     },{
        //       type:'bytes',
        //       name:'data'
        //     }
        //   ]
        // },[address,quantity,this.web3.utils.asciiToHex(_uri)])
        //
        //   const txt = await this.web3.eth.sendTransaction({
        //     from:address,
        //     to:NFTEA,
        //     data:encodedFunction
        //   }).on('transactionHash',(hash)=>{
        //         resolve(hash)
        //         // console.log(hash)
        //     })
        //     .on('receipt',(receipt)=>{
        //        console.log(receipt)
        //     })
        //     .on('confirmation',(confirmationNumber, receipt)=>
        //     {
        //     //console.log(confirmationNumber, receipt)
        //     }).on('error', console.error);

      } catch (error) {
        console.log(error)
        resolve({ success: false, msg: error });
      }

    })
  }

  public SET_AUCTION(user:any,_nft: any, _buyNowPrice: any, _value:any, _parnters:any,_sips:any,_quantity:any,_royalty:any,_taxParnters:any,_taxSips:any,_creator:any, _market:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // console.log(_quantity)
      // console.log(_nft,_buyNowPrice,_value,_parnters,_sips,_quantity,_royalty,_taxParnters,_taxSips,_creator)

      await this.GET_WEB3();
      let m:any = new Big(_buyNowPrice);
      m = m.toFixed(0);
      let _buyNow = this.web3.utils.toWei(m.toString(), 'nanoether');

      let o:any = new Big(_value);
      o = o.toFixed(0);
      let _minPrice = this.web3.utils.toWei(o.toString(), 'nanoether');

      const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
        name: "SET_AUCTION",
        type: "function",
        inputs: [{
          type: 'uint256',
          name: '_nft'
        }, {
          type: 'uint256',
          name: '_buyNowPrice'
        }, {
          type: 'uint256',
          name: '_minPrice'
        }, {
          type: 'address[]',
          name: '_parnters'
        }, {
          type: 'uint256[]',
          name: '_sips'
        },{
          type: 'uint256',
          name: '_quantity'
        },{
          type: 'uint256',
          name: '_royalty'
        },{
          type: 'address[]',
          name: '_taxParnters'
        },{
          type: 'uint256[]',
          name: '_taxSips'
        },{
          type:'address',
          name:'_nftCreator'
        },{
          type:'uint256',
          name:'_market'
        }
        ]
      }, [_nft, _buyNow, _minPrice, _parnters, _sips,_quantity,_royalty,_taxParnters,_taxSips,_creator,_market])
      const txt = await this.web3.eth.sendTransaction({
        from:user,
        to:environment.TEASHOP,
        gas: 1000000,
        data:encodedFunction
      }).on('transactionHash',(hash)=>{

        console.log(hash)

            resolve({ success: true, msg: hash });
            // console.log(hash)
        })
        .on('receipt',(receipt)=>{
           console.log(receipt)
           const _auction = Moralis.Object.extend("auction");
           const _query = new Moralis.Query(_auction);
           _query.equalTo('seller',user);
           _query.equalTo('nft', _nft);
           _query.equalTo('pending',1);
           _query.first()
           .then((results)=>{
             if(results){
               console.log('updating auction')

                   //console.log(res)
                   results.set('active',1);
                   results.set('pending',0);
                   results.set('sold',0);
                   results.save();
                   // _query.save(res);
                   // console.log('auction canceled');
               }
             });
        })
        .on('confirmation',(confirmationNumber, receipt)=>
        {
        //console.log(confirmationNumber, receipt)
        }).on('error', console.error);
      // const transactionHash = await ethereum.request({
      //   method: 'eth_sendTransaction',
      //   gas: 1000000,
      //   params: [
      //     {
      //       from: user,
      //       to: TEASHOP,
      //       data: encodedFunction
      //     },
      //   ],
      // });
      // Handle the result
      //resolve(transactionHash);
    })
  }
  public GET_PRICE(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {

        //Get token price on PancakeSwap v2 BSC
        //await this.GET_WEB3();
          const options = {
            address: "0xb4668238Acf0314A7b4e153368e479fCd2E09831",
            chain: "bsc",
            exchange: "PancakeSwapv2"
          };
          const price = await Moralis.Web3API.token.getTokenPrice(options);
          // console.log('price is ' + JSON.stringify(price));
        resolve(price);

      } catch (error) {
        resolve(error.error);
      }

    })
  }
  public GET_FEATURED(_featured: any): Promise<string> {
    return new Promise(async (resolve, reject) => {

      const options = { chain: environment.CHAIN, token_address: NFTEA };
      const featured = await Moralis.Web3API.account.getNFTsForContract(options);
      // const options = { address: NFT, chain: "bsc testnet" };
      // const NFTS = await Moralis.Web3API.token.getAllTokenIds(options);
      //console.log(NFTS);
      // const options = { chain: '0x3', address: '0x2f626fFe2c53Fcbb069c152942d5FCA05e87B272', token_address: contract };
      // const NFTS = await Moralis.Web3API.account.getNFTsForContract(options);
      //console.log(NFTS)
      resolve(featured);
    })
  }


  public SEARCH_NFT(album:any):Promise<any>{
    return new Promise(async (resolve,reject)=>{

      const options = { q: album, chain: environment.CHAIN, token_address:NFTEA, filter: "album" };
      const NFTs = await Moralis.Web3API.token.searchNFTs(options);
      resolve(NFTs);

    })
  }

  public GET_NFT(_nft: any, _ipfs: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('geting those nfts sir')
        //alert("working")
        // const options = {
        //   contractAddress: NFT,
        //   functionName: "GET_NFT",
        //   abi: ABINFTEA,
        //   chain:56,
        //   params: {
        //     _nft: _nft,
        //   _ipfs: 'none'
        //   },
        // };
        //
        // const receipt = await Moralis.executeFunction(options);
        //alert(receipt)
        // console.log(receipt)
        //resolve(receipt)


        let result;
        await this.GET_WEB3();
        const contract =  new this.web3.eth.Contract(ABINFTEA, NFTEA);
        if (_nft > 0) {

          result = await contract.methods.GET_NFT(_nft, 'none').call();

        } else {

          result = await contract.methods.GET_NFT(0, _ipfs).call();
        }
        // console.log(result);
        resolve(result);
      } catch (error) {
        //alert(error);
        console.log(error)

      }

    })
  }

  public GET_USER_NFTS(_user:any): Promise<any>{
    return new Promise(async (resolve, reject)=>{
      try {

        console.log('getting user nft\'s' + _user);
        await this.GET_WEB3();
        const options = { chain: environment.CHAIN, address:_user, token_address: NFTEA };
        const NFTS = await Moralis.Web3API.account.getNFTs(options);
        console.log(NFTS);
        let result = {success:true,msg:NFTS.result};
        resolve(result);

      } catch (error) {
        //console.log(JSON.stringify(error.error));
        let result = {success:false, msg:error.error};
        resolve(result);
        //console.log(JSON.stringify(error.error));
      }


    })
  }

  public GET_AUCTION_NFTS(): Promise<any>{
    return new Promise(async (resolve, reject)=>{
      try {

        await this.GET_WEB3();
        const options = { chain: environment.CHAIN, address:environment.TEASHOP, token_address: NFTEA };
        const NFTS = await Moralis.Web3API.account.getNFTsForContract(options);
        // console.log(NFTS);

        resolve(NFTS.result);

      } catch (error) {
        console.log(error);
      }


    })
  }

  public GET_STIR(_nft: any): Promise<any> {
    return new Promise(async (resolve, reject) => {

      await this.GET_WEB3();
      let contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
      let result = await contract.methods.GET_STIR(_nft).call();



      resolve(result);
    })
  }
  public GET_NFT_BALANCE(user:any,_nft: any): Promise<any> {
    return new Promise(async (resolve, reject) => {

      await this.GET_WEB3();
      let contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
      let result = await contract.methods.balanceOf(user,_nft).call();
      resolve(result);
    })
  }
  public GET_WRAP(_nft: any): Promise<any> {
    return new Promise(async (resolve, reject) => {

      await this.GET_WEB3();
      let contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
      let result = await contract.methods._WN2_N(_nft).call();
      resolve(result);
    })
  }
  public GET_APPROVAL(_user:any,_contract:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("gettting approval" + _contract);
        await this.GET_WEB3();
        let result;
        if(_contract==1){
          let contract = new this.web3.eth.Contract(ABITOKEN, TOKEN);
          result = await contract.methods.allowance(_user,NFTEA).call();
          console.log("one works");

        }else if(_contract==2){
          let contract = new this.web3.eth.Contract(ABITOKEN, TOKEN);
          result = await contract.methods.allowance(_user, TEASHOP).call();

        }else if(_contract==3){
          let contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
          result = await contract.methods.isApprovedForAll(_user,TEASHOP).call();
          console.log("3 works");

        }else if(_contract==4){

          // let contract = new this.web3.eth.Contract(ABIWALLTOKEN, WALLTOKEN);
          // result = await contract.methods.allowance(_user,NFT).call();
          console.log("4 works");

        }else if(_contract==5){

          let contract = new this.web3.eth.Contract(ABITOKEN, TOKEN);
          result = await contract.methods.allowance(_user,HANDS).call();
          console.log("5 works");

        }else if(_contract==6){

          let contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
          result = await contract.methods.isApprovedForAll(_user,HANDS).call();
          console.log("5 works");

        }

        resolve(result);

      } catch (error) {

      }
    })
  }
  public GET_SHOP_APPROVAL(user:any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("gettting shop approval ");
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABINFTEA, NFTEA);
        let result = await contract.methods.isApprovedForAll(user,environment.TEASHOP).call();
        console.log(result);
        resolve(result);

      } catch (error) {

      }
    })
  }
  public SET_APPROVE(_user: any, _value:any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {
        console.log("approving " + _user);
        let _operator;
      await this.GET_WEB3();
      // let web3 = await Moralis.Web3.activeWeb3Provider.activate();
      if(_value==1){
          /// approves the nft to spend tea tokens on users behalf

          //let m:any = new Big(_value*1000000000000);
          let m:any = new Big(30000000000000);
          m = m.toFixed(0);
          _value = this.web3.utils.toWei(m.toString(), 'nanoether');

          _operator = NFTEA;
          const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
            name: "approve",
            type: "function",
            inputs: [{
              type:'address',
              name:'_token'
            },{
              type:'uint256',
              name:'_value'
            }]
          }, [_operator,_value])
            const txt = await this.web3.eth.sendTransaction({
              from:_user,
              to:TOKEN,
              gas: 100000,
              data:encodedFunction
            }).on('transactionHash',(hash)=>{

              console.log(hash)

                  resolve({ success: true, msg: hash });
                  // console.log(hash)
              })
              .on('receipt',(receipt)=>{
                 console.log(receipt)
              })
              .on('confirmation',(confirmationNumber, receipt)=>
              {
              //console.log(confirmationNumber, receipt)
              }).on('error', console.error);

          // const transactionHash = await ethereum.request({
          //   method: 'eth_sendTransaction',
          //   gas: 1000000,
          //   params: [
          //     {
          //       from: _user,
          //       to: TOKEN,
          //       data: encodedFunction
          //     },
          //   ],
          // }).then(async (res) => {
          //   resolve({ success: true, msg: res });
          // },(error)=>{
          //   console.log(error);
          // });

        }if(_value==2){
            /// approves the teashop to spend tea tokens on users behalf
            console.log("enabling auction")
            _operator = TEASHOP;
            let m:any = new Big(30000000000000);
            m = m.toFixed(0);
            _value = this.web3.utils.toWei(m.toString(), 'nanoether');

            const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
              name: "approve",
              type: "function",
              inputs: [{
                type:'address',
                name:'_token'
              },{
                type:'uint256',
                name:'_value'
              }]
            }, [_operator,_value])
            const txt = await this.web3.eth.sendTransaction({
              from:_user,
              to:TOKEN,
              gas: 100000,
              data:encodedFunction
            }).on('transactionHash',(hash)=>{

              console.log(hash)

                  resolve({ success: true, msg: hash });
                  // console.log(hash)
              })
              .on('receipt',(receipt)=>{
                 console.log(receipt)
              })
              .on('confirmation',(confirmationNumber, receipt)=>
              {
              //console.log(confirmationNumber, receipt)
              }).on('error', console.error);
            // const transactionHash = await ethereum.request({
            //   method: 'eth_sendTransaction',
            //   gas: 1000000,
            //   params: [
            //     {
            //       from: _user,
            //       to: TOKEN,
            //       data: encodedFunction
            //     },
            //   ],
            // }).then(async (res) => {
            //   resolve({ success: true, msg: res });
            // },(error)=>{
            //   console.log(error);
            // });

          }else if(_value==3){

            console.log('enabling auction' + _user + NFTEA + TEASHOP)
          _operator = TEASHOP;
          ///teashop and hold/move nfts
          const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
            name: "setApprovalForAll",
            type: "function",
            inputs: [{
              type:'address',
              name:'operator'
            },{
              type:'bool',
              name:'approved'
            }]
          }, [_operator,true])
          const txt = await this.web3.eth.sendTransaction({
            from:_user,
            to:NFTEA,
            gas: 50000,
            data:encodedFunction
          }).on('transactionHash',(hash)=>{

            console.log(hash)

                resolve({ success: true, msg: hash });
                // console.log(hash)
            })
            .on('receipt',(receipt)=>{
               console.log(receipt)
            })
            .on('confirmation',(confirmationNumber, receipt)=>
            {
            //console.log(confirmationNumber, receipt)
            }).on('error', console.error);
          // const transactionHash = await ethereum.request({
          //   method: 'eth_sendTransaction',
          //   gas: 1000000,
          //   params: [
          //     {
          //       from: _user,
          //       to: NFTEA,
          //       data: encodedFunction
          //     },
          //   ],
          // }).then(async (res) => {
          //   resolve({ success: true, msg: res });
          // });
        }if(_value==4){
            /// approves the teashop to spend tea tokens on users behalf
            // _operator = NFT;
            // let m:any = new Big(1*10000000);
            // m = m.toFixed(0);
            // _value = this.web3.utils.toWei(m.toString(), 'ether');
            //
            // const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
            //   name: "approve",
            //   type: "function",
            //   inputs: [{
            //     type:'address',
            //     name:'_token'
            //   },{
            //     type:'uint256',
            //     name:'_value'
            //   }]
            // }, [_operator,_value])
            // const txt = await this.web3.eth.sendTransaction({
            //   from:_user,
            //   to:WALLTOKEN,
            //   gas: 1000000,
            //   data:encodedFunction
            // }).on('transactionHash',(hash)=>{
            //
            //   console.log(hash)
            //
            //       resolve({ success: true, msg: hash });
            //       // console.log(hash)
            //   })
            //   .on('receipt',(receipt)=>{
            //      console.log(receipt)
            //   })
            //   .on('confirmation',(confirmationNumber, receipt)=>
            //   {
            //   //console.log(confirmationNumber, receipt)
            //   }).on('error', console.error);
            // const transactionHash = await ethereum.request({
            //   method: 'eth_sendTransaction',
            //   gas: 1000000,
            //   params: [
            //     {
            //       from: _user,
            //       to: WALLTOKEN,
            //       data: encodedFunction
            //     },
            //   ],
            // }).then(async (res) => {
            //   resolve({ success: true, msg: res });
            // },(error)=>{
            //   console.log(error);
            // });

          }if(_value==5){
              /// approves the teashop to spend wall tokens on users behalf
              console.log("enabling hands game")
              _operator = HANDS;
              let m:any = new Big(30000000000000);
              m = m.toFixed(0);
              _value = this.web3.utils.toWei(m.toString(), 'nanoether');

              const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
                name: "approve",
                type: "function",
                inputs: [{
                  type:'address',
                  name:'_token'
                },{
                  type:'uint256',
                  name:'_value'
                }]
              }, [_operator,_value])
              const txt = await this.web3.eth.sendTransaction({
                from:_user,
                to:TOKEN,
                gas: 1000000,
                data:encodedFunction
              }).on('transactionHash',(hash)=>{

                console.log(hash)

                    resolve({ success: true, msg: hash });
                    // console.log(hash)
                })
                .on('receipt',(receipt)=>{
                   console.log(receipt)
                })
                .on('confirmation',(confirmationNumber, receipt)=>
                {
                //console.log(confirmationNumber, receipt)
                }).on('error', console.error);
              // const transactionHash = await ethereum.request({
              //   method: 'eth_sendTransaction',
              //   gas: 1000000,
              //   params: [
              //     {
              //       from: _user,
              //       to: WALLTOKEN,
              //       data: encodedFunction
              //     },
              //   ],
              // }).then(async (res) => {
              //   resolve({ success: true, msg: res });
              // },(error)=>{
              //   console.log(error);
              // });

            }if(_value==6){
                /// approves the teashop to spend wall tokens on users behalf
                _operator = HANDS;
                ///teashop and hold/move nfts
                const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
                  name: "setApprovalForAll",
                  type: "function",
                  inputs: [{
                    type:'address',
                    name:'operator'
                  },{
                    type:'bool',
                    name:'approved'
                  }]
                }, [_operator,true])
                const txt = await this.web3.eth.sendTransaction({
                  from:_user,
                  to:NFTEA,
                  gas: 50000,
                  data:encodedFunction
                }).on('transactionHash',(hash)=>{

                  console.log(hash)

                      resolve({ success: true, msg: hash });
                      // console.log(hash)
                  })
                  .on('receipt',(receipt)=>{
                     console.log(receipt)
                  })
                  .on('confirmation',(confirmationNumber, receipt)=>
                  {
                  //console.log(confirmationNumber, receipt)
                  }).on('error', console.error);

              }


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }

  public SET_HANDS(_user:any,_type:any, _title:any, _token:any,_nft:any,_value:any,_entryFee:any,_hodlBalance:any,_minPlayers:any,_start:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if(_token==1){
          _token=TOKEN;
        }
        console.log(_token);
        await this.GET_WEB3();
        // console.log(web3);
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SET_GAME",
          type: "function",
          inputs: [{
            type: 'string',
            name: '_title'
          }, {
            type: 'uint256',
            name: '_nft'
          },{
            type:'address',
            name:'_token'
          },{
            type:'uint256',
            name:'_entry'
          },{
            type:'uint256',
            name:'_sato'
          },{
            type:'uint256',
            name:'_start'
          },{
            type:'uint256',
            name:'_maxPlayers'
          },{
            type:'uint256',
            name:'_value'
          }
          ]
        }, [_title, _nft,_token,_entryFee,_hodlBalance,_start,_minPlayers,_value])
        const txt = await this.web3.eth.sendTransaction({
          from:_user,
          to:HANDS,
          gas: 1000000,
          data:encodedFunction
        }).on('transactionHash',(hash)=>{

          console.log(hash)

          resolve({success:true, msg: hash });
              // console.log(hash)
          })
          .on('receipt',(receipt)=>{
             console.log(receipt)
          })
          .on('confirmation',(confirmationNumber, receipt)=>
          {
          //console.log(confirmationNumber, receipt)
        }).on('error', (error)=>{
          resolve({success:false, msg: error.error });

        });
        // const transactionHash = await ethereum.request({
        //   method: 'eth_sendTransaction',
        //   gas: 1000000,
        //   params: [
        //     {
        //       from: user,
        //       to: NFTEA,
        //       data: encodedFunction
        //     },
        //   ],
        // }).then((res: any) => {
        //
        //   resolve(res);
        // })
      } catch (error) {
        resolve(error);
      }
    })
  }
}
