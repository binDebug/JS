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

  
}
