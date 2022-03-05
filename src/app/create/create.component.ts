import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router, ActivatedRoute, ParamMap } from '@angular/router'
import { SERVICE } from '../service/web3.service';
import Swal from 'sweetalert2'
import { NgxSummernoteModule } from 'ngx-summernote';
const Moralis = require('moralis');
declare var $: any;
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {


  userIsConnected:any;
  user:any;
  api:any;
  _createCollection: FormGroup;
  _createNFT:FormGroup;
  _reserve:FormGroup;
  toFile:any;
  type:any;
  albumImage:any;
  albumImageHash:any;
  _creatorSplit:any;
  imageURI:any;
  imageName:any;
  imageURL:any;
  mediaName:any;
  mediaURL:any;
  connected:boolean;
  createType:string;
  service:any;
  web3:any;
  showCreateCollection:boolean;
  showCreateNFT:boolean;
  showCreateBrew:boolean;
  showApproval:boolean;
  showEnableToken:boolean;
  showEnableNFT:boolean;
  showEnableShop:boolean;
  showEnableTeaPass:boolean;
  showEnableHANDTEA:boolean;
  showEnableHANDNFT:boolean;
  ALBUMID:any;
  ALBUM:any;
  pass:boolean;
  lat:any;
  lng:any;
  useThisId = 0;
  mintPass = 0
  fileUploading:boolean;

  constructor(private formBuilder: FormBuilder, private _service: SERVICE, private zone: NgZone, private cd: ChangeDetectorRef,private route: ActivatedRoute,private router: Router) {


    this.service = _service;
    this.pass = true;
    this.showApproval = false;
    this.createForm();

  }

  async ngOnInit() {

    const appId = environment.moralisKey;
    const serverUrl = environment.moralisSerer;
    Moralis.start({ serverUrl, appId });

    this.type = this.route.snapshot.params.type
        this.user = localStorage.getItem('user');
        if(this.user){
          this.connected = true;
          this.start();

        }

  }
  async getGeo(){

  navigator.geolocation.getCurrentPosition(function(position) {
  this.lat = position.coords.latitude;
  this.lng = position.coords.longitude;
  });

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
    // let approve4 = await this.service.GET_APPROVAL(this.user,4)
    // console.log("wall token approve for " + approve4);
    // if(approve4==0){
    //   this.showApproval = true
    //   this.showEnableTeaPass = true;
    //
    // }else{
    //   //console.log(approve4)
    //   this.showEnableTeaPass = false;
    //
    // }
    ///approve HANDS to manage TEA
    // let approve5 = await this.service.GET_APPROVAL(this.user,5)
    // if(approve5==0){
    //   this.showApproval = true
    //   this.showEnableHANDTEA = true;
    //
    // }else{
    //   console.log(approve5)
    //   this.showEnableHANDTEA = false;
    //
    // }
    // ///approve HANDS to manage NFT
    // let approve6 = await this.service.GET_APPROVAL(this.user,6)
    // if(approve6==0){
    //   this.showApproval = true
    //   this.showEnableHANDNFT = true;
    //
    // }else{
    //   console.log(approve6)
    //   this.showEnableHANDNFT = false;
    //
    // }
    //console.log(this.showApproval);
    if(!this.showApproval){

      const _uProfile = Moralis.Object.extend("profile");
      const _query = new Moralis.Query(_uProfile);
      _query.equalTo('user',this.user);
      const results = await _query.first();
      this.COLLECTOR = results;
      if(!this.COLLECTOR){
        setTimeout(() => {
          this.pop('error', 'lets set up your profile');
        }, 3000);
      }else{

         await this.service.GET_ALBUMS(this.user)
          .then((res:any)=>{
            console.log(res);
            this.ALBUMCOUNT = res.length;
            if(this.ALBUMCOUNT>0){
              // console.log(res);
              let ALBUMS:any = res;
              this.ALBUM = [];

              ALBUMS.forEach(element => {
                //console.log('album is ' + element);
                this.service.GET_ALBUM(element)
                .then((res:any)=>{

                  this.ALBUM.push({id:element,name:res._name});
                  console.log(this.ALBUM);
                })
              });
            }

          })
      }
    }
  }
  async upload(event:any, type:any){

    this.fileUploading = true;
    this.toFile = event.target.files[0]
    const imageFile = new Moralis.File(this.toFile.name,this.toFile)
    await imageFile.saveIPFS();
    this.imageURI= await imageFile.ipfs();
    this.zone.run(()=>{
      if(type==1){
        this.imageURL = this.imageURI
        this.imageName = this.toFile.name
        this.mediaURL = 'https:/null'
        this.mediaName = 'null'
        this.fileUploading = false;
      }else{
        this.mediaURL = this.imageURI
        this.mediaName = this.toFile.name
        if(this.mediaURL){
          this.fileUploading = false;
          this.pop('success', 'file uploaded');
          console.log(this.mediaURL)
        }

      }
    // console.log(this.imageURI)
  })

  }
async createAlbum(type:any){

if(!this.user){

    Swal.fire({
      title: 'Error!',
      text: 'Connect your wallet to create a album',
      icon: 'error',
      confirmButtonText: 'Close'
    })

  }else if (!this._createCollection.controls.name.value) {
  Swal.fire({
    title: 'Error!',
    text: 'Whats the name of this album?',
    icon: 'error',
    confirmButtonText: 'Close'
  })

}else {

  this.service.SET_ALBUM(this.user,this._createCollection.controls.name.value,this.mediaURL,this._createCollection.controls.category)
  .then((res:any)=>{
    if(res.success){

        const _album = Moralis.Object.extend("album");
        const _p = new _album();

        _p.save({
          name:this._createCollection.controls.name.value,
          story:this._createCollection.controls.story.value,
          category:this._createCollection.controls.category.value,
          media:this.mediaURL,
          user:this.user

        }).then(async(res:any)=>{

          this.pop('success', 'album created');
          this.start();


        })

    }else{
      this.pop('error', res.msg);
    }
  })


  }
}
async SET_IDS(){
  console.log("setting ids");
  this.service.SET_IDS(this.user,this._reserve.controls.quantity.value)
  .then(async(res:any)=>{
    console.log(res);
    if(res.success){
      this.pop('success', 'id\'s reserved')
      this.router.navigate(['/mint/'+this.user]);

    }else{
      this.pop('error', res.msg);
    }
  })
}
async SET_NFT(){
  // let _totalSplit = (this._createNFT.controls.split1Value.value + this._createNFT.controls.split2Value.value) + this._createNFT.controls.split3Value.value;
  // let _creatorSplit = 100 - _totalSplit;
  // console.log(_totalSplit, _creatorSplit, this._createNFT.controls.split1Value.value, this._createNFT.controls.split2Value.value, this._createNFT.controls.split3Value.value);
  // if(this.pass){
  //
  //   Swal.fire({
  //     title: 'Error!',
  //     text: 'get an avatar and cover before creating albums and nft\'s',
  //     icon: 'error',
  //     confirmButtonText: 'Close'
  //   })
  //
  // }else
  if(!this.imageURL){

    Swal.fire({
      title: 'Error!',
      text: 'Upload an image or file',
      icon: 'error',
      confirmButtonText: 'Close'
    })

  }else if(!this.user){

    Swal.fire({
      title: 'Error!',
      text: 'Connect your wallet to create an nftea',
      icon: 'error',
      confirmButtonText: 'Close'
    })

  }else if (!this._createNFT.controls.title.value) {
  Swal.fire({
    title: 'Error!',
    text: 'Whats the name of this nftea?',
    icon: 'error',
    confirmButtonText: 'Close'
  })
}else if (!this._createNFT.controls.quantity.value) {
Swal.fire({
  title: 'Error!',
  text: 'How many are you minting?',
  icon: 'error',
  confirmButtonText: 'Close'
})
}else if (!this._createNFT.controls.royalty.value && this._createNFT.controls.royalty.value!=0) {
Swal.fire({
  title: 'Error!',
  text: 'Whats the royalty you want to collect?',
  icon: 'error',
  confirmButtonText: 'Close'
})
}else if (this._createNFT.controls.split1.value && !this._createNFT.controls.split1Value.value || !this._createNFT.controls.split1.value && this._createNFT.controls.split1Value.value) {
Swal.fire({
  title: 'Error!',
  text: 'Whats the royalty for split 1?',
  icon: 'error',
  confirmButtonText: 'Close'
})
}else if (this._createNFT.controls.split2.value && !this._createNFT.controls.split2Value.value || !this._createNFT.controls.split2.value && this._createNFT.controls.split2Value.value) {
Swal.fire({
  title: 'Error!',
  text: 'Whats the royalty for split 2?',
  icon: 'error',
  confirmButtonText: 'Close'
})
}else if (this._createNFT.controls.split3.value && !this._createNFT.controls.split3Value.value || !this._createNFT.controls.split3.value && this._createNFT.controls.split3Value.value) {
Swal.fire({
  title: 'Error!',
  text: 'Whats the royalty for split 3?',
  icon: 'error',
  confirmButtonText: 'Close'
})
}else if (this._createNFT.controls.prop1.value && !this._createNFT.controls.prop1Value.value || !this._createNFT.controls.prop1.value && this._createNFT.controls.prop1Value.value) {
Swal.fire({
  title: 'Error!',
  text: 'Whats the value for property 1?',
  icon: 'error',
  confirmButtonText: 'Close'
})
}else if (this._createNFT.controls.prop2.value && !this._createNFT.controls.prop2Value.value || !this._createNFT.controls.prop2.value && this._createNFT.controls.prop2Value.value) {
Swal.fire({
  title: 'Error!',
  text: 'Whats the value for property 2?',
  icon: 'error',
  confirmButtonText: 'Close'
})
}else if (this._createNFT.controls.prop3.value && !this._createNFT.controls.prop3Value.value || !this._createNFT.controls.prop3.value && this._createNFT.controls.prop3Value.value) {
Swal.fire({
  title: 'Error!',
  text: 'Whats the value for property 3?',
  icon: 'error',
  confirmButtonText: 'Close'
})
}else if (this._createNFT.controls.prop4.value && !this._createNFT.controls.prop4Value.value || !this._createNFT.controls.prop4.value && this._createNFT.controls.prop4Value.value) {
Swal.fire({
  title: 'Error!',
  text: 'Whats the value for property 4?',
  icon: 'error',
  confirmButtonText: 'Close'
})
}else if (this._createNFT.controls.prop5.value && !this._createNFT.controls.prop5Value.value || !this._createNFT.controls.prop5.value && this._createNFT.controls.prop5Value.value) {
Swal.fire({
  title: 'Error!',
  text: 'Whats the value for property 5?',
  icon: 'error',
  confirmButtonText: 'Close'
})
}else if (this._createNFT.controls.prop6.value && !this._createNFT.controls.prop6Value.value || !this._createNFT.controls.prop6.value && this._createNFT.controls.prop6Value.value) {
Swal.fire({
  title: 'Error!',
  text: 'Whats the value for property 6?',
  icon: 'error',
  confirmButtonText: 'Close'
})
}else if(!this.ALBUMID){
  Swal.fire({
    title: 'Error!',
    text: 'What album is this NFTea going to?',
    icon: 'error',
    confirmButtonText: 'Close'
  })
}else if ((this._createNFT.controls.split1Value.value+this._createNFT.controls.split2Value.value) + this._createNFT.controls.split3Value.value>=100){

  Swal.fire({
    title: 'Error!',
    text: 'royalty split totals more than 100%, live some for yourself',
    icon: 'error',
    confirmButtonText: 'Close'
  })

}else if (this._createNFT.controls.split1Value.value>0 && this._createNFT.controls.split1Value.value<1){

  Swal.fire({
    title: 'Error!',
    text: 'use whole number for royalty split 1',
    icon: 'error',
    confirmButtonText: 'Close'
  })
}else if (this._createNFT.controls.split2Value.value>0 && this._createNFT.controls.split2Value.value<1){

  Swal.fire({
    title: 'Error!',
    text: 'use whole number for royalty split 2',
    icon: 'error',
    confirmButtonText: 'Close'
  })
}else if (this._createNFT.controls.split3Value.value>0 && this._createNFT.controls.split3Value.value<1){

  Swal.fire({
    title: 'Error!',
    text: 'use whole number for royalty split 3',
    icon: 'error',
    confirmButtonText: 'Close'
  })
}else {

      let _totalSplit = (this._createNFT.controls.split1Value.value + this._createNFT.controls.split1Value.value) + this._createNFT.controls.split3Value.value;
      this._creatorSplit = 100 - _totalSplit;
      // console.log(this._creatorSplit, _totalSplit);
      let attributes = [];
      if(this._createNFT.controls.prop1.value && this._createNFT.controls.prop1Value.value){
        attributes.push({name:this._createNFT.controls.prop1.value,value:this._createNFT.controls.prop1Value.value});
      }
      if(this._createNFT.controls.prop2.value && this._createNFT.controls.prop2Value.value){
        attributes.push({name:this._createNFT.controls.prop2.value,value:this._createNFT.controls.prop2Value.value});
      }
      if(this._createNFT.controls.prop3.value && this._createNFT.controls.prop3Value.value){
        attributes.push({name:this._createNFT.controls.prop3.value,value:this._createNFT.controls.prop3Value.value});
      }
      if(this._createNFT.controls.prop4.value && this._createNFT.controls.prop4Value.value){
        attributes.push({name:this._createNFT.controls.prop4.value,value:this._createNFT.controls.prop4Value.value});
      }
      if(this._createNFT.controls.prop5.value && this._createNFT.controls.prop5Value.value){
        attributes.push({name:this._createNFT.controls.prop5.value,value:this._createNFT.controls.prop5Value.value});
      }
      if(this._createNFT.controls.prop6.value && this._createNFT.controls.prop6Value.value){
        attributes.push({name:this._createNFT.controls.prop6.value,value:this._createNFT.controls.prop6Value.value});
      }
      let sips = [];

      sips.push({partner:this.user,sip:this._creatorSplit});

      if(this._createNFT.controls.split1.value && this._createNFT.controls.split1Value.value){
        sips.push({partner:this._createNFT.controls.split1.value,sip:this._createNFT.controls.split1Value.value});
      }
      if(this._createNFT.controls.split2.value && this._createNFT.controls.split2Value.value){
        sips.push({partner:this._createNFT.controls.split2.value,sip:this._createNFT.controls.split2Value.value});
      }
      if(this._createNFT.controls.split3.value && this._createNFT.controls.split3Value.value){
        sips.push({partner:this._createNFT.controls.split3.value,sip:this._createNFT.controls.split3Value.value});
      }

      let metaData:any = new Object();
      metaData.title = this._createNFT.controls.title.value;
      metaData.quantity = this._createNFT.controls.quantity.value;
      metaData.story = this._createNFT.controls.story.value;
      metaData.royalty = this._createNFT.controls.royalty.value;
      metaData.sips = sips;
      metaData.attributes = attributes;
      metaData.image = this.imageURI;
      metaData.creator = this.user;
      metaData.created = this.curday('/')
      metaData.album = this.ALBUMID;
      metaData.wrappedTo = 0;
      metaData.media = this.mediaURL;
      let p = [];
      p.push(this.user);
      p.push(this._createNFT.controls.split1.value || '0x000000000000000000000000000000000000dEaD');
      p.push(this._createNFT.controls.split2.value || '0x000000000000000000000000000000000000dEaD');
      p.push(this._createNFT.controls.split3.value || '0x000000000000000000000000000000000000dEaD');

      let s = [];
      s.push(this._creatorSplit);
      s.push(this._createNFT.controls.split1Value.value || 0);
      s.push(this._createNFT.controls.split2Value.value || 0);
      s.push(this._createNFT.controls.split3Value.value || 0);

      const metaDataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metaData))});
      await metaDataFile.saveIPFS();
      const metaDataURI = await metaDataFile.ipfs();
      let ipfs = metaDataFile._ipfs;
      //console.log(this.useThisId);
      this.service.MINT(metaDataURI,this.user,this._createNFT.controls.quantity.value,metaDataFile._ipfs,this._createNFT.controls.royalty.value,p,s,this._createNFT.controls.story.value,this.ALBUMID,this.user,this.useThisId,this.mintPass)
      .then(async(res:any)=>{
        // console.log(res)
          if(res.success){

            this.pop('success', 'NFTea minting');

          }else{
            this.pop('error', 'could not mint for some reason');
          }

      })
  }
}
SET_APPROVE(_value:any){

  this.service.SET_APPROVE(this.user,_value)
  .then((res:any)=>{
    if(res.success){
      if(_value==1){

        this.pop('success','TEA\'s enabled')

      }
      if(_value==2){

        this.pop('success','NFT\'s enabled')

      }
      if(_value==3){

        this.pop('success','Tea Shop enabled')

      }
      if(_value==4){

        this.pop('success','TEA\'s enabled')

      }

    }else{
      this.pop('error', res.msg);
    }
  })
}
private setAlbumID(albumID:any, albumName:any){
  this.ALBUMID = albumID;
  this.pop('success', 'you selected album ' + albumName);
  //console.log('id is ' + this.ALBUMID);
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

// async listener(){
//
//   let web3 = await Moralis.enableWeb3({provider:'walletconnect'});
//   const contract = new web3.eth.Contract(ABISHOP, TEASHOP);
//   contract.events.allEvents()
//   .on('data',(event) => {
//
//   })
// }

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
  this._reserve = this.formBuilder.group({

    quantity: [''],

  });

}

}
