import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { GroupsProvider } from '../../providers/groups/groups';

/**
 * Generated class for the GroupcontactsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groupcontacts',
  templateUrl: 'groupcontacts.html',
})
export class GroupcontactsPage {

  mycontacts = [];
  groupmembers = [];
  searchstring;
  tempmycontacts = [];
  newcontact;
  constructor(public navCtrl: NavController, public navParams: NavParams, public requestservice: RequestsProvider,
              public events: Events, public groupservice: GroupsProvider) {
  }

  ionViewWillEnter() {
    this.requestservice.getmyContacts();
    this.events.subscribe('gotintogroup', () => {
      this.mycontacts.splice(this.mycontacts.indexOf(this.newcontact.uid), 1);
      this.tempmycontacts = this.mycontacts;
    })
    this.events.subscribe('friends', () => {
      
      this.mycontacts = [];
      this.mycontacts = this.requestservice.contacts;
      this.groupmembers = this.groupservice.currentgroup;
      for (var key in this.groupmembers)
        for (var friend in this.mycontacts) {
          if (this.groupmembers[key].uid === this.mycontacts[friend].uid)
            this.mycontacts.splice(this.mycontacts.indexOf(this.mycontacts[friend]), 1);
        }
      this.tempmycontacts = this.mycontacts;
    })
  }

  searchuser(searchbar) {
    let tempfriends = this.tempmycontacts;

    var q = searchbar.target.value;

    if (q.trim() === '') {
      this.mycontacts = this.tempmycontacts;
      return;
    }

    tempfriends = tempfriends.filter((v) => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
    
    this.mycontacts = tempfriends;

  }

  addContact(contact) {
    this.newcontact = contact;
    this.groupservice.addmember(contact);
  }

}
