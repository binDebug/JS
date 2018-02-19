import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { GroupsProvider } from '../../providers/groups/groups';

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
    //this.groupservice.addmember(contact);
  }

}
