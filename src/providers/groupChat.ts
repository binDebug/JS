import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { groupMessage } from '../models/group-message';

@Injectable()
export class GroupChatProvider {
  constructor(private afDatabase: AngularFireDatabase) {
  }

  getMessages (groupId: string) {

      return this.afDatabase.list("/groupChats", res => res.orderByKey().equalTo(groupId));
  }

  saveMessage(message: groupMessage) {
    let item = {
      message: message.message,
      attachment: message.attachment,
      sender: message.sender
    }  

    return this.afDatabase.list("/groupChats/" + message.groupId).set(message.timeStamp.toString(), item);
  }

}
