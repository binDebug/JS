import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
import { GroupinfoPage } from '../groupinfo/groupinfo';
import { GroupmembersPage } from '../groupmembers/groupmembers';
import { GroupcontactsPage } from '../groupcontacts/groupcontacts';

@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
})
export class GroupchatPage {

  owner: boolean = false;
  groupName;
  constructor(public navCtrl: NavController, public navParams: NavParams, public groupservice: GroupsProvider,
    public actionSheet: ActionSheetController) {
    this.groupName = this.navParams.get('groupName');
    // this.groupservice.getownership(this.groupName).then((res) => {
    //   if (res)
    //     this.owner = true;
    // }).catch((err) => {
    //   alert(err);
    // })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupchatPage');
  }

  presentOwnerSheet() {
    let sheet = this.actionSheet.create({
      title: 'Group Actions',
      buttons: [
        {
          text: 'Add member',
          icon: 'person-add',
          handler: () => {
            this.navCtrl.push(GroupcontactsPage);
          }
        },
        {
          text: 'Remove member',
          icon: 'remove-circle',
          handler: () => {
            this.navCtrl.push(GroupmembersPage);
          }
        },
        {
          text: 'Group Info',
          icon: 'person',
          handler: () => {
            this.navCtrl.push(GroupinfoPage, { groupName: this.groupName });
          }
        },
        {
          text: 'Delete Group',
          icon: 'trash',
          handler: () => {
            //this.groupservice.deletegroup();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        }
      ]
    })
    sheet.present();
  }

  presentMemberSheet() {
    let sheet = this.actionSheet.create({
      title: 'Group Actions',
      buttons: [
        {
          text: 'Leave Group',
          icon: 'log-out',
          handler: () => {
            //this.groupservice.leavegroup();
          }
        },
        {
          text: 'Group Info',
          icon: 'person',
          handler: () => {
            this.navCtrl.push(GroupinfoPage, { groupName: this.groupName });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        }
      ]
    })
    sheet.present();
  }

}
