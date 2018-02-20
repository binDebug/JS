import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
import { Group } from '../../models/group';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { user } from '../../models/user';
import { UsersProvider } from '../../providers/users';
import { GroupcontactsPage } from '../groupcontacts/groupcontacts';

@IonicPage()
@Component({
  selector: 'page-newgroup',
  templateUrl: 'newgroup.html',
})
export class NewgroupPage implements OnInit {

  groupId: string = null;
  group = {  } as Group;
  userData: any;
  uid: string = null;
  isUploading: boolean = false;
  members: user[] = [];

  constructor(public navCtrl: NavController, 
      public navParams: NavParams, 
      public groupservice: GroupsProvider, 
      public userService: UsersProvider,
      public toastCtrl: ToastController,
      public loadingCtrl: LoadingController) {

        this.groupId = this.navParams.get('groupId');
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
    }

    if(this.groupId && (this.groupId != null)) {
      this.groupservice.getGroup(this.groupId).valueChanges()
      .subscribe(data => {
        if(data && (data.length > 0)) {
          this.group = data[0] as Group;
        }
      },
      err => this.showError(err.message));

      this.getMembers();
    }
  }

  getMembers() {
    
    this.members = [];

    this.groupservice.getGroupMembers(this.groupId).valueChanges()
    .subscribe(data => {
      
      if(data && (data.length > 0)) {
        data.forEach(element => {
        this.userService.getUser(element['uid']).valueChanges()
        .subscribe(data1 => {
          if(data1 && (data1.length > 0)) {
            let item = this.members.find(p => p['id'] === data1[0]['id']);
            if(item) {
              item.displayName = data1[0]['displayName'];
            }
            else {
              this.members.push(data1[0] as user);
            }
          }
        },
        err => this.showError(err.message));
      });
      }
      
    }
    , err => this.showError(err.message));
  }

  addMember() {
    let data = {
      groupId: this.groupId
    };
    this.navCtrl.push(GroupcontactsPage, data);
  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }

  saveGroup() {
    if(!this.groupId) {
      this.group.ownerId = this.uid;
      
      this.groupservice.addGroup(this.group)
      .then(data => {
        this.groupId = data.key;
        this.groupservice.updateGroupId(this.groupId)
        .then(data => {})
        .catch(err => this.showError(err.message));

        this.groupservice.addGroupMember(this.groupId, this.uid)
        .then(data => {})
        .catch(err => this.showError(err.message));
      }
      , err => this.showError(err.message));
     
    }
    else {
      this.groupservice.updateName(this.groupId, this.group.name)
      .then(data => {})
      .catch(err => this.showError(err.message));
    }
  }

  UpdatedDesc() {
    this.groupservice.updateDescription(this.groupId, this.group.description)
    .then(data => {})
    .catch(err => this.showError(err.message));

  }

  removeMember(item: user) {
    this.groupservice.removeGroupMember(this.groupId, item['id'])
    .then(data => {this.getMembers();})
    .catch(err => this.showError(err.message));
  }
  
}
