import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, LoadingController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-buddychat',
  templateUrl: 'buddychat.html',
})
export class BuddychatPage {
  @ViewChild('content') content: Content;
  buddy: any;
  newmessage;
  allmessages = [];
  photoURL;
  imgornot = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public chatservice: ChatProvider, public events: Events,
  public loadingctrl: LoadingController, public imgstore:ImghandlerProvider, public zone: NgZone) {
    this.buddy = this.chatservice.buddy;
    this.photoURL = "assets\imgs\chatuser.png";
    // firebase.auth().currentUser.photoURL;
    this.scrollTo();
    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      this.zone.run(() => {
        this.allmessages = this.chatservice.buddymessages;
        for (var key in this.allmessages) {
          if (this.allmessages[key].message.substring(0, 4) == 'http')
          this.imgornot.push(true);
          else
          this.imgornot.push(false);
        }
      })
      
      //this.scrollTo();
    })
  }
  addmessage(){
   this.chatservice.addnewmessage(this.newmessage).then(() => {
     this.content.scrollToBottom();
     this.newmessage = '';
   })
  }
  ionViewDidEnter(){
   this.chatservice.getbuddymessages();
  }
  scrollTo(){
    setTimeout(() => {
      this.content.scrollToBottom();
  
    },1000);
  }
  sendPicMsg(){
  let loader = this.loadingctrl.create({
    content: 'please wait'
  });
  loader.present();
  this.imgstore.picmsgstore().then((imgurl) => {
    loader.dismiss();
    this.chatservice.addnewmessage(imgurl).then(() =>{
      this.content.scrollToBottom();
      this.newmessage='';
    })
  }).catch((err) => {
    alert(err);
    loader.dismiss();
  })
  }
}
