import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Group } from '../../models/group';

@Injectable()
export class GroupsProvider {
  constructor(private afDatabase: AngularFireDatabase) {
  }

  getGroup(groupId: string) {
    return this.afDatabase.list('groups', res => res.orderByKey().equalTo(groupId));
  }

  getMyGroups(uid: string) {
    return this.afDatabase.list('groupmembers', res => res.orderByChild('uid').equalTo(uid));
  }

  getGroupMembers(groupId: string) {
    return this.afDatabase.list('groupmembers', res => res.orderByChild('groupid').equalTo(groupId));
  }

  addGroup(group: Group) {
    return this.afDatabase.list('/groups').push(group);
  }

  addGroupMember(groupid: string, uid: string) {
    let item = {
      groupid: groupid,
      uid: uid
    };
    let key = groupid + '_' + uid;

    return this.afDatabase.list('/groupmembers').set(key, item);
  }

  removeGroupMember(groupid: string, uid: string) {
    
    let key = groupid + '_' + uid;

    return this.afDatabase.list('/groupmembers').remove(key);
  }

  updateName(groupId: string, name: string) {
    return this.afDatabase.list('groups/' + groupId).set('name', name);
  }

  updateDescription(groupId: string, description: string) {
    return this.afDatabase.list('groups/' + groupId).set('description', description);
  }

  updateGroupId(groupId: string) {
    return this.afDatabase.list('groups/' + groupId).set('id', groupId);
  }
}
