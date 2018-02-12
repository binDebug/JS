import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Contact } from '../models/contact';
import { contactRequest } from '../models/contactRequest';

@Injectable()
export class ContactsProvider {
  
  constructor(private afDatabase: AngularFireDatabase) {
  }

  getContacts(uid: string) {
    return this.afDatabase.list("/contacts", res => res.orderByKey().equalTo(uid));
  }

  addContact(contact: contactRequest, imgUrl: string)  {
    
    let promise = new Promise((resolve, reject) => {
    let item = {
        contactId: contact.sender,
        contactImgUrl: contact.senderImgUrl ? contact.senderImgUrl : null
      };
    this.afDatabase.list("/contacts/" + contact.recipient)
        .set(item.contactId, item)
        .then(data => {
          let item = {
            contactId: contact.recipient,
            contactImgUrl: contact.senderImgUrl ? contact.senderImgUrl : null
          };

          this.afDatabase.list("/contacts/" + contact.sender)
          .set(item.contactId, item)
          .then(data1 => resolve())
          .catch(err => reject(err));
        })
        .catch(err => reject(err));
      });
      return promise;
    }
}
