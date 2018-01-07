import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, LoadingController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { AppConstants } from '../../models/constants';
import firebase from 'firebase';

/**
 * Generated class for the ContactchatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contactchats',
  templateUrl: 'contactchats.html',
})
export class ContactchatsPage {
  @ViewChild('content') content: Content;
  contact: any;
  newmessage;
  allmessages = [];
  pictureURL;
  imgornot;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    public chatservice: ChatProvider,
    public events: Events, public zone: NgZone, public loadingControl: LoadingController) {
    this.contact = this.chatservice.contact;
    this.pictureURL = firebase.auth().currentUser.photoURL;

    this.scrollTo();
    this.events.subscribe(AppConstants.CONTACT_MESSAGES, () => {
      this.allmessages = [];
      this.imgornot = [];
      this.zone.run(() => {
        this.allmessages = this.chatservice.contactmessages;
        for (var key in this.allmessages) {
          if (this.allmessages[key].message.substring(0, 4) == 'http')
            this.imgornot.push(true);
          else
            this.imgornot.push(false);
        }
      })
    })
  }

  addMessage() {
    this.chatservice.addNewMessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }

  ionViewDidEnter() {
    this.chatservice.getContactMessages();
  }

  scrollTo() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  // sendPicMsg() {
  //   let loader = this.loadingCtrl.create({
  //     content: 'Please wait'
  //   });
  //   loader.present();
  //   this.imgstore.picmsgstore().then((imgurl) => {
  //     loader.dismiss();
  //     this.chatservice.addnewmessage(imgurl).then(() => {
  //       this.scrollto();
  //       this.newmessage = '';
  //     })
  //   }).catch((err) => {
  //     alert(err);
  //     loader.dismiss();
  //   })
  // }

}
