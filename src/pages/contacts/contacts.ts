import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { ChatProvider } from '../../providers/chat/chat';
import { AppConstants } from '../../models/constants';
import { UsersPage } from '../users/users';
import { ContactchatsPage } from '../contactchats/contactchats';

/**
 * Generated class for the ContactsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  myRequests;
  myContacts;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public requestservice: RequestsProvider,
    public events: Events, public alertControl: AlertController,
    public chatservice: ChatProvider) {
    console.log('ionViewDidLoad Constructor');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
  }

  ionViewWillEnter() {
    this.requestservice.getmyRequests();
    this.requestservice.getmyContacts();
    this.myContacts = [];
    this.events.subscribe(AppConstants.GOT_REQUESTS, () => {
      this.myRequests = [];
      this.myRequests = this.requestservice.contactdetails;
    })
    this.events.subscribe(AppConstants.CONTACTS_FETCHED, () => {
      this.myContacts = [];
      this.myContacts = this.requestservice.contacts;
    })
  }

  ionViewDidLeave() {
    this.events.unsubscribe(AppConstants.GOT_REQUESTS);
    this.events.unsubscribe(AppConstants.CONTACTS_FETCHED);
  }


  addContact() {
    console.log("addContact clicked.");
    this.navCtrl.push(UsersPage);
  }

  accept(item) {
    this.requestservice.acceptRequest(item).then(() => {

      let newalert = this.alertControl.create({
        title: 'Friend added',
        subTitle: 'Tap on the friend to chat with him',
        buttons: ['Okay']
      });
      newalert.present();
    })
  }

  ignore(item) {
    this.requestservice.deleteRequest(item).then(() => {

    }).catch((err) => {
      alert(err);
    })
  }

  contactChat(contact) {
    this.chatservice.initializeContact(contact);
    this.navCtrl.push(ContactchatsPage);
  }

}
