import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import firebase from 'firebase';
import { AppConstants } from '../../models/constants';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {
  firecontactchats = firebase.database().ref('/contactchats');
  contact: any;
  contactmessages = [];

  constructor(public events: Events) {
    
  }

  initializeContact(contact) {
    this.contact = contact;
  }

  addNewMessage(message) {
    if (this.contact) {
      var promise = new Promise((resolve, reject) => {
        this.firecontactchats.child(firebase.auth().currentUser.uid).
        child(this.contact.uid).push().set({
          sentby: firebase.auth().currentUser.uid,
          message: message,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          this.firecontactchats.child(this.contact.uid).
          child(firebase.auth().currentUser.uid).push().set({
            sentby: firebase.auth().currentUser.uid,
            message: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            resolve(true);
          }).catch((err) => {
            reject(err);
          })
        })
      })
      return promise;
    }
  }

  getContactMessages() {
    let temp;
    this.firecontactchats.child(firebase.auth().currentUser.uid).
    child(this.contact.uid).on('value', (snapshot) => {
      this.contactmessages = [];
      temp = snapshot.val();
      for (var tempkey in temp) {
        this.contactmessages.push(temp[tempkey]);
      }
      this.events.publish(AppConstants.CONTACT_MESSAGES);
    })
  }

}
