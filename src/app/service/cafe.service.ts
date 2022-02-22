import {NgZone } from "@angular/core";

import { Injectable } from '@angular/core';
const Moralis = require('moralis');
declare var require;
declare var ethereum: any;
const ABIAUDIO = require('../../build/audio/artifacts/abi.json');
const AUDIO = "0xE6684ed3144C273456c476836681DEa07658968A";
import Swal from 'sweetalert2'
import { HttpClient } from '@angular/common/http';
const baseURL = 'https://api.nftea.app/';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CAFESERVICE {

  isMobile: any;
  web3:any;
  user:any;

  constructor(private http: HttpClient,private router: Router,private zone: NgZone) {
    //this.storage = localStorage
    // this.isMobile = this.deviceService.isMobile();

    this.GET_WEB3();
  }

  async LAUNCHROOM(_room:any,_host:any){

    this.http.post('/api/rooms')
    .subscribe((res:any)=>{
      //console.log(res)
      const _cafe = Moralis.Object.extend("cafe");
      const _p = new _cafe(_room);
      _p.save({

        owner:_host,
        room:_room,
        roomURL:res.url,
        dailyID:res.id,
        roomName:res.name,
        active:1

      }).then(async()=>{

        this.pop('success', 'your room is ready');
        this.zone.run(()=>{
          this.router.navigate(['/cafe/room/'+_room]);

        })
    });
    })
  }

  async CLOSEROOM(_room:any,_host:any){

    const _query = new Moralis.Query(_uCafe);
    _query.equalTo('room',_room);
    _query.equalTo('active', 1);
    const results = await _query.first();
    if(results){
      results.active = 0;
      _query.save(results)
      .then((res:any)=>{
        if(res.length>0){

          this.pop('success','profile updated');

        }else{

          this.pop('error', 'error creating your profile');
        }
      })

    }else{
      this.pop('error', ' room already closed');
    }
  }

  async GET_WEB3(): Promise<any> {

    this.user = localStorage.getItem('user');
    if (this.isMobile && !this.web3) {
      this.web3 = await Moralis.enableWeb3({ provider: 'walletconnect', chainId: 56 });
    } else if (!this.isMobile && !this.web3) {
      this.web3 = await Moralis.enableWeb3();
    }
    let res = { success: true };
    return res;

  }

  async LISTENER(){
    console.log("listening");
    await this.GET_WEB3();
    const contract = new this.web3.eth.Contract(ABIAUDIO, AUDIO);
    contract.events.allEvents()
    .on('data',(event) => {
      //console.log(event)
      let _user = localStorage.getItem('user');
      if(event.event=='roomOpen'){
        let _room = event.returnValues[0];
        let _host = event.returnValues[1].toLowerCase();
        if(_host==_user){
          //console.log('adding room to database');
          let r = this.LAUNCHROOM(_room,_host);

        }else{

          console.log(_host,_user);

        }
      }else if (event.event=='passConnected'){

        let _room = event.returnValues[0];
        let _listener = event.returnValues[1].toLowerCase();
        if(_listener==_user){
          this.pop('success', 'pass connected');
          //this.ADDLISTENER(_room,_user);
        }

      }else if (event.event=='handRaised'){

        let _room = event.returnValues[0];
        let _listener = event.returnValues[1].toLowerCase();
        if(_listener==_user){

          this.pop('success', 'you hands is raised');
          //this.ADDSPEAKER(_room,_user);
        }
      }else if (event.event=='roomClosed'){

        let _room = event.returnValues[0];
        let _host = event.returnValues[1].toLowerCase();
        if(_host==_user){

          this.CLOSEROOM(_room,_host);
          //this.ADDSPEAKER(_room,_user);
        }
      }
    })
  }
  public SET_USER(_user: any, _amount: any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SETUSER",
          type: "function",
          inputs: []
        }, [])
        const txt = await this.web3.eth.sendTransaction({
          from: _user,
          to: AUDIO,
          gas: 1000000,
          data: encodedFunction
        }).on('transactionHash', (hash) => {


          resolve({ success: true, msg: hash });
          // console.log(hash)
        })
          .on('receipt', (receipt) => {
            console.log(receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            //console.log(confirmationNumber, receipt)
          }).on('error', console.error);


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }

  public SET_ROOM(_user:any,_title:any,_fee:any,_details:any,_category:any,_nft:any,_hosts:any):Promise<any>{

    return new Promise(async(resolve,reject)=>{
      try {
        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SETROOM",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_fee'

          },{
            type: 'address[]',
            name: '_cohosts'

          },{
            type: 'string',
            name: '_info'

          },{
            type: 'string',
            name: '_title'

          },{
            type: 'uint256',
            name: '_nft'

          },{
            type: 'string',
            name: '_category'

          }]
        }, [10,_hosts,_details,_title,_nft,_category])
        const txt = await this.web3.eth.sendTransaction({
          from: _user,
          to: AUDIO,
          gas: 1000000,
          data: encodedFunction
        }).on('transactionHash', (hash) => {


          resolve({ success: true, msg: hash });
          // console.log(hash)
        })
          .on('receipt', (receipt) => {
            console.log(receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            //console.log(confirmationNumber, receipt)
          }).on('error', console.error);

      } catch (error) {

      }
    })
  }
  public CONNECTPASS(_user:any,_room: any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "CONNECTPASS",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_room'

          }]
        }, [_room])
        const txt = await this.web3.eth.sendTransaction({
          from: _user,
          to: AUDIO,
          gas: 1000000,
          data: encodedFunction
        }).on('transactionHash', (hash) => {


          resolve({ success: true, msg: hash });
          // console.log(hash)
        })
          .on('receipt', (receipt) => {
            console.log(receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            //console.log(confirmationNumber, receipt)
          }).on('error', console.error);


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public SET_DISCONNECT(_user:any,_room: any,_index:any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SETDISCONNECT",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_room'

          },{
            type: 'uint256',
            name: '_index'

          }]
        }, [_room,_index])
        const txt = await this.web3.eth.sendTransaction({
          from: _user,
          to: AUDIO,
          gas: 1000000,
          data: encodedFunction
        }).on('transactionHash', (hash) => {


          resolve({ success: true, msg: hash });
          // console.log(hash)
        })
          .on('receipt', (receipt) => {
            console.log(receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            //console.log(confirmationNumber, receipt)
          }).on('error', console.error);


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public SET_HAND_RAISED(_user:any,_room: any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SETRAISEHAND",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_room'

          }]
        }, [_room])
        const txt = await this.web3.eth.sendTransaction({
          from: _user,
          to: AUDIO,
          gas: 1000000,
          data: encodedFunction
        }).on('transactionHash', (hash) => {


          resolve({ success: true, msg: hash });
          // console.log(hash)
        })
          .on('receipt', (receipt) => {
            console.log(receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            //console.log(confirmationNumber, receipt)
          }).on('error', console.error);


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public SET_CLOSE_ROOM(_user:any,_room: any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SETCLOSEROOM",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_room'

          }]
        }, [_room])
        const txt = await this.web3.eth.sendTransaction({
          from: _user,
          to: AUDIO,
          gas: 1000000,
          data: encodedFunction
        }).on('transactionHash', (hash) => {


          resolve({ success: true, msg: hash });
          // console.log(hash)
        })
          .on('receipt', (receipt) => {
            console.log(receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            //console.log(confirmationNumber, receipt)
          }).on('error', console.error);


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public SET_PAYHOST(_user:any,_room: any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SETPAYHOST",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_room'

          }]
        }, [_room])
        const txt = await this.web3.eth.sendTransaction({
          from: _user,
          to: AUDIO,
          gas: 1000000,
          data: encodedFunction
        }).on('transactionHash', (hash) => {


          resolve({ success: true, msg: hash });
          // console.log(hash)
        })
          .on('receipt', (receipt) => {
            console.log(receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            //console.log(confirmationNumber, receipt)
          }).on('error', console.error);


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public SET_ADMIN(_user: any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SETADMIN",
          type: "function",
          inputs: [{
            type: 'address',
            name: '_user'

          }]
        }, [_user])
        const txt = await this.web3.eth.sendTransaction({
          from: _user,
          to: AUDIO,
          gas: 1000000,
          data: encodedFunction
        }).on('transactionHash', (hash) => {


          resolve({ success: true, msg: hash });
          // console.log(hash)
        })
          .on('receipt', (receipt) => {
            console.log(receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            //console.log(confirmationNumber, receipt)
          }).on('error', console.error);


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public SET_PINK(_user:any,_pink: any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "SETPINK",
          type: "function",
          inputs: [{
            type: 'address',
            name: '_pink'

          }]
        }, [_pink])
        const txt = await this.web3.eth.sendTransaction({
          from: _user,
          to: AUDIO,
          gas: 1000000,
          data: encodedFunction
        }).on('transactionHash', (hash) => {


          resolve({ success: true, msg: hash });
          // console.log(hash)
        })
          .on('receipt', (receipt) => {
            console.log(receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            //console.log(confirmationNumber, receipt)
          }).on('error', console.error);


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public SET_MINT(_user:any,_quantity: any,_data:any,_canTransfer:boolean, _ipfs:any,_price:any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "mint",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_quantity'

          },{
            type: 'bytes',
            name: '_data'

          },{
            type: 'bool',
            name: '_canTransfer'

          },{
            type: 'string',
            name: '_ipfs'

          },{
            type: 'uint256',
            name: '_price'

          }]
        }, [_quantity,_data,_canTransfer,_ipfs,_price])
        const txt = await this.web3.eth.sendTransaction({
          from: _user,
          to: AUDIO,
          gas: 1000000,
          data: encodedFunction
        }).on('transactionHash', (hash) => {


          resolve({ success: true, msg: hash });
          // console.log(hash)
        })
          .on('receipt', (receipt) => {
            console.log(receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            //console.log(confirmationNumber, receipt)
          }).on('error', console.error);


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public SET_BUY_NFT(_user:any,_nft: any,_quantity:any): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {

        await this.GET_WEB3();
        const encodedFunction = this.web3.eth.abi.encodeFunctionCall({
          name: "buyNFT",
          type: "function",
          inputs: [{
            type: 'uint256',
            name: '_nft'

          },{
            type: 'uint256',
            name: '_quantity'

          }]
        }, [_nft,_quantity])
        const txt = await this.web3.eth.sendTransaction({
          from: _user,
          to: AUDIO,
          gas: 1000000,
          data: encodedFunction
        }).on('transactionHash', (hash) => {


          resolve({ success: true, msg: hash });
          // console.log(hash)
        })
          .on('receipt', (receipt) => {
            console.log(receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            //console.log(confirmationNumber, receipt)
          }).on('error', console.error);


      } catch (error) {
        resolve({ success: false, msg: error });
      }
    })
  }
  public GET_PURSE(_creator: any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("in the back " + user);
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABIPINK, AUDIO);
        let result = await contract.methods.purse().call();
        // console.log(result);
        resolve(result);

      } catch (error) {

      }
    })
  }
  public GET_ROOM(_room: any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("in the back " + user);
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABIAUDIO, AUDIO);
        let result = await contract.methods.idToRoom(_room).call();
        // console.log(result);
        resolve(result);

      } catch (error) {

      }
    })
  }

  public GET_LISTENERS(_room: any): Promise<string> {
    console.log("getting listeners");
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("in the back " + user);
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABIAUDIO, AUDIO);
        let result = await contract.methods.GET_LISTENERS(_room).call();
        //console.log(result);
        resolve(result);

      } catch (error) {

      }
    })
  }

  public GET_HANDS(_room: any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("in the back " + user);
        await this.GET_WEB3();
        const contract = new this.web3.eth.Contract(ABIAUDIO, AUDIO);
        let result = await contract.methods.GET_RAISED_HANDS(_room).call();
        // console.log(result);
        resolve(result);

      } catch (error) {

      }
    })
  }

  public GET_PRICE(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {

      //Get token price on PancakeSwap v2 BSC
      await this.GET_WEB3();
        const options = {
          address: "0x96c42f22078f6c48d419006dC2CC08c94aB4389F",
          chain: "bsc",
          exchange: "PancakeSwapv2"
        };
        const price = await Moralis.Web3API.token.getTokenPrice(options);

      resolve(price);

    } catch (error) {
      resolve(error.error);
    }

  })
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

}
