import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { GroupsProvider } from '../../providers/groups/groups';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ContactsProvider } from '../../providers/contacts';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { UsersProvider } from '../../providers/users';

@Component({
  selector: 'page-groupcontacts',
  templateUrl: 'groupcontacts.html',
})
export class GroupcontactsPage implements OnInit{

  mycontacts = [];
  groupmembers = [];
  searchstring;
  tempmycontacts = [];
  groupId: string;
  newcontact;
  userData: any;
  uid: string = null;

  constructor(public navCtrl: NavController, 
      public navParams: NavParams, 
      private contactsService: ContactsProvider,
      private userService: UsersProvider,
      private toastCtrl: ToastController,
      public events: Events, 
      public groupservice: GroupsProvider) {
        this.groupId = this.navParams.get('groupId');
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;

      
      this.contactsService.getContacts(this.uid)
      .valueChanges().subscribe(data => {
        if(data) {
          
          this.parseContacts( data);
        }
      },
      err => this.showError(err.message));
      
    }

  }

  
  parseContacts(data) {
    if(data && (data.length > 0)) {
      Object.keys(data[0]).forEach((item, index) => {
        let contactId = item;
        if(contactId !== this.uid) {
          this.userService.getUser(contactId)
          .valueChanges().subscribe(res => {
            if(res && (res.length > 0)) {
              let contact = {
                Id: contactId,
                pictureUrl: res[0]['pictureUrl'],
                displayName: res[0]['displayName']
              };
              this.mycontacts.push(contact);
              
            }
          },
          err => this.showError(err.message));
        }
      });
      this.tempmycontacts = this.mycontacts;
    }
  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
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
    
    this.groupservice.addGroupMember(this.groupId, contact.Id)
    .then(data => {
      this.navCtrl.pop();
    })
    .catch(err => this.showError(err.message));
  }

}
