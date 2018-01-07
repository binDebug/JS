import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import firebase from 'firebase';
import { UsersProvider } from '../users';
import { contactRequest } from '../../models/contactRequest';
import { AppConstants } from '../../models/constants';

/*
  Generated class for the RequestsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestsProvider {
  firerequest = firebase.database().ref('/requests');
  firecontacts = firebase.database().ref('/contacts');

  contacts;
  contactdetails;

  constructor(public usersprovider: UsersProvider, public events: Events) {
    console.log('Hello RequestsProvider Provider');
  }

  sendRequest(request: contactRequest) {
    // var promise = new Promise((resolve, reject) => { 
    //   this.firerequest.child(request.recipient).push().set(
    //     { sender: request.sender }).
    //     then(() => 
    //     { resolve({ success: true }); }).
    //     catch((err) => { reject(err); }) }) 
    //     return promise;

    let promise = new Promise((resolve, reject) => {
      this.firerequest.child(request.recipient).push().set(
        { sender: request.sender }
      ).then(() => {
        resolve({ success: true })
      }).catch((error) => {
        reject(error);
      })
    })

    return promise;
  }

  getmyRequests() {
    let allmyrequests;
    var myrequests = [];
    this.firerequest.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      allmyrequests = snapshot.val();
      myrequests = [];
      for (var i in allmyrequests) {
        myrequests.push(allmyrequests[i].sender);
      }
      this.usersprovider.getallusers().then((res) => {
        var allusers = res;
        this.contactdetails = [];
        for (var j in myrequests)
          for (var key in allusers) {
            if (myrequests[j] === allusers[key].uid) {
              this.contactdetails.push(allusers[key]);
            }
          }
        this.events.publish(AppConstants.GOT_REQUESTS);
      })
    })
  }

  acceptRequest(contact: any) {
    var promise = new Promise((resolve, reject) => {
      this.contacts = [];
      this.firecontacts.child(firebase.auth().currentUser.uid).push().set({
        uid: contact.uid
      }).then(() => {
        this.firecontacts.child(contact.uid).push().set({
          uid: firebase.auth().currentUser.uid
        }).then(() => {
          this.deleteRequest(contact).then(() => {
            resolve(true);
          })
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  deleteRequest(contact: any) {
    var promise = new Promise((resolve, reject) => {
      this.firerequest.child(firebase.auth().currentUser.uid).orderByChild('sender').
        equalTo(contact.uid).once('value', (snapshot) => {
          let somekey;
          for (var key in snapshot.val())
            somekey = key;
          this.firerequest.child(
            firebase.auth().currentUser.uid).child(somekey).remove().then(() => {
              resolve(true);
            })
        })
        .then(() => {

        }).catch((err) => {
          reject(err);
        })
    })
    return promise;
  }

  getmyContacts() {
    let contactsUid = [];
    this.firecontacts.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allContacts = snapshot.val();
      this.contacts = [];
      for (var i in allContacts) {
        contactsUid.push(allContacts[i].uid);
      }

      this.usersprovider.getallusers().then((users) => {
        this.contacts = [];
        for (var j in contactsUid)
          for (var key in users) {
            if (contactsUid[j] === users[key].uid) {
              this.contacts.push(users[key]);
            }
          }
        this.events.publish(AppConstants.CONTACTS_FETCHED);
      }).catch((err) => {
        alert(err);
      })

    })
  }

}
