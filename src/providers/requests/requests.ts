import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { UsersProvider } from '../users';
import { contactRequest } from '../../models/contactRequest';
//import { AppConstants } from '../../models/constants';

@Injectable()
export class RequestsProvider {

  constructor(private afDatabase: AngularFireDatabase,
              public usersprovider: UsersProvider, 
              public events: Events) {
    
  }

  sendContactRequest(request: contactRequest) {
    let id = request.sender + '_' + request.recipient;
    
    return this.afDatabase.list("/contactRequests").set(id, request);
  }

  getContactRequests(uid: string) {
    return this.afDatabase.list("/contactRequests", res => res.orderByChild('recipient').equalTo(uid));
  }
  
  deleteContactRequest(contact: any) {
    var id=contact.sender + '_' + contact.recipient;
    return this.afDatabase.list("/contactRequests/" + id).remove();
  }

  /*
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
*/
}
