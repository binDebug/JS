import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { message } from '../../models/message';

@Injectable()
export class ChatProvider {
  constructor(private afDatabase: AngularFireDatabase) {
  }

  getMessages (id1: string, id2: string) {
    let id = '';

    if(id1 < id2)
      id = id1 + '_' + id2;
    else 
      id = id2 + '_' + id1;
    
      return this.afDatabase.list("/contactChats", res => res.orderByKey().equalTo(id));
  }

  saveMessage(message: message) {
    let id = '';

    if(message.id1 < message.id2)
      id = message.id1 + '_' + message.id2;
    else 
      id = message.id2 + '_' + message.id1;
    
    let item = {
      message: message.message,
      id1: message.id1,
      id2: message.id2,
      attachment: message.attachment
    }  

    
    return this.afDatabase.list("/contactChats/" + id).set(message.timeStamp.toString(), item);
  }

}
