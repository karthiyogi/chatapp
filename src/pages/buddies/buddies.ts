import { UserProvider } from './../../providers/user/user';
import { RequestsProvider } from './../../providers/requests/requests';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { connreq } from '../../models/interfaces/request';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-buddies',
  templateUrl: 'buddies.html',
})
export class BuddiesPage {
  newrequest = {} as connreq;
   filteredusers = [];
   temparr = [];
   searchstring : any ;
  constructor(public navCtrl: NavController, public navParams: NavParams, public userservice: UserProvider, public alertCtrl : AlertController, public requestservice : RequestsProvider ) {
    this.userservice.getallusers().then((res: any) =>{
      this.filteredusers = res;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuddiesPage');
  }
searchuser(searchbar){
  this.filteredusers = this.temparr;
  var q = searchbar.target.value;
  if (q.trim() =='') {
    return;
  }
  this.filteredusers = this.filteredusers.filter((v) =>
{
  if ((v.displayname.toLowerCase().indexOf(q.toLowerCase())) > -1) {
    return true;
  }
  return false;
})
}
sendreq(recipient){
 this.newrequest.sender = firebase.auth().currentUser.uid;
 this.newrequest.recipient = recipient.uid;
 if (this.newrequest.sender == this.newrequest.recipient)
 alert ('You are your friend always');
 else {
   let successalert = this.alertCtrl.create({
     title : 'Request sent',
     subTitle : 'Your Request sent to ' + recipient.displayname,
     buttons: ['ok']
   });
 
 
 this.requestservice.sendrequest(this.newrequest).then((res: any) => {
   if(res.success)
   successalert.present();
   let sentuser = this.filteredusers.indexOf(recipient);
   this.filteredusers.splice(sentuser, 1);
 }).catch((err) => {
   alert(err);
 })
}
}
}
