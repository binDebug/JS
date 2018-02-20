import { Component } from '@angular/core';
import {  NavController, NavParams, Events, LoadingController } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
import { NewgroupPage } from '../newgroup/newgroup';
import { GroupchatPage } from '../groupchat/groupchat';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Group } from '../../models/group';

@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage implements OnInit {
  allMyGroups: Group[] = [];
  userData: any;
  uid: string = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams, 
    public events: Events,
    public toastCtrl: ToastController, 
    public groupservice: GroupsProvider) {
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      
      this.groupservice.getMyGroups(this.uid).valueChanges()
      .subscribe(data => {
        if(data && (data.length > 0)) {
          this.allMyGroups = [];
          data.forEach(item => {
            this.groupservice.getGroup(item['groupid']).valueChanges()
            .subscribe(data1 => {
              if(data1 && data1.length > 0) {
                let item = this.allMyGroups.find(p => p.id === data1[0]['id']);
                if(item) {
                  item.name = data1[0]['name'];
                }
                else {
                  this.allMyGroups.push(data1[0] as Group);
                }
              }
            },
            err => this.showError(err.message));
          });
        }
      },
    err => this.showError(err.message));

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

  addgroup() {
    this.navCtrl.push(NewgroupPage);
  }

  settings(item: Group) {
    let data = {
      groupId: item.id
    };

    this.navCtrl.push(NewgroupPage, data);
  }

  openchat(item: Group) {
    let data = {
      groupName: item.name,
      groupId: item.id
    };
this.navCtrl.push(GroupchatPage);
  }
}
