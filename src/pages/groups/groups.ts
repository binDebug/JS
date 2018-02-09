import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
import { NewgroupPage } from '../newgroup/newgroup';
import { GroupchatPage } from '../groupchat/groupchat';

/**
 * Generated class for the GroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
  allMyGroups;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
    public loadingCtrl: LoadingController, public groupservice: GroupsProvider) {
    console.log('Initialized');
  }

  ionViewDidLoad() {
    console.log('Page Loaded GroupsPage');
  }

  ionViewWillEnter() {
    let loader = this.loadingCtrl.create({
      content: 'Getting your groups, Please wait...'
    });
    loader.present();
    this.groupservice.getMyGroups();
    loader.dismiss();
    this.events.subscribe('newgroup', () => {
      this.allMyGroups = this.groupservice.mygroups;
    })
  }

  ionViewDidLeave() {
    this.events.unsubscribe('newgroup');
  }

  addgroup() {
    this.navCtrl.push(NewgroupPage);
  }

  openchat(group) {
    this.groupservice.getintogroup(group.groupName);
    this.navCtrl.push(GroupchatPage, { groupName: group.groupName });
  }

}
