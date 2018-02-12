import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { ChatProvider } from '../../providers/chat/chat';
import { AppConstants } from '../../models/constants';
import { UsersPage } from '../users/users';
import { ContactchatsPage } from '../contactchats/contactchats';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ContactsProvider } from '../../providers/contacts';
import { UsersProvider } from '../../providers/users';

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage implements OnInit {

  myRequests: any;
  myContacts: any;
  userData: any;
  uid: string = null;
  imgUrl: string = null;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public requestservice: RequestsProvider,
    private userService: UsersProvider,
    private contactsService: ContactsProvider
    //public events: Events, 
    //public alertControl: AlertController,
    //public chatservice: ChatProvider
  ) {
    
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;

      this.userService.getUser(this.uid)
      .valueChanges().subscribe(data => {
        if(data && (data.length > 0)) {
          this.imgUrl = data[0]['pictureUrl'];
        }
      },
    err => this.showError(err.message));

      this.requestservice.getContactRequests(this.uid)
      .valueChanges().subscribe(data => {
        if(data) {
          this.myRequests = data;
        }
      },
      err => this.showError(err.message));
  
      this.contactsService.getContacts(this.uid)
      .valueChanges().subscribe(data => {
        if(data) {
          this.myContacts = data;
        }
      },
      err => this.showError(err.message));
      
    }

    
  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }

  addContact() {
    
    this.navCtrl.push(UsersPage);
  }

  accept(item) {
    console.log('item', item);
    this.contactsService.addContact(item, this.imgUrl).then(data => {
      this.requestservice.deleteContactRequest(item).then(data => {
        this.showError('Friend request accepted.');
      })
      .catch(err => this.showError(err.message));
    })
    .catch(err => this.showError(err.message));
  }

  ignore(item) {
    this.requestservice.deleteContactRequest(item)
    .catch(err => this.showError(err.message));
  }

  /*
  ionViewDidEnter() {
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



  
  contactChat(contact) {
    this.chatservice.initializeContact(contact);
    this.navCtrl.push(ContactchatsPage);
  }
*/
}
