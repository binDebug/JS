import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { groupMessage } from '../../models/group-message';
import { GroupChatProvider } from '../../providers/groupChat';
import { UsersProvider } from '../../providers/users';

@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
})
export class GroupchatPage implements OnInit{

  groupName: string;
  groupId: string;
  userData: any;
  uid: string = null;
  newmessage: string = '';
  allmessages = [];
  @ViewChild('content') content: Content;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private groupChatService: GroupChatProvider,
    private userService: UsersProvider,
    private toastCtrl: ToastController) {
    this.groupName = this.navParams.get('groupName');
    this.groupId = this.navParams.get('groupId');
    
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
    }
  }

  addMessage() {

    let message = {
      groupId: this.groupId,
      timeStamp: Date.now(),
      sender: this.uid,
      message: this.newmessage,
      attachment: false
    } as groupMessage;

    this.groupChatService.saveMessage(message)
    .then(data => {
      this.newmessage = '';
    })
    .catch(err => this.showError(err.message));
  }

  sendPicMsg() {
    
  }

  attachment() {

  }

  getMessages() {
    
    this.groupChatService.getMessages(this.groupId)
    .valueChanges().subscribe(data => {
      if(data && (data.length > 0)) {
        data.forEach(element => {
          let item = {
            sender: element['sender'],
            message: element['message'],
            timeStamp: element['timeStamp'],
            senderName: '',
            senderUrl: ''
          };
          this.userService.getUser(item.sender).valueChanges()
          .subscribe(data1 => {
            if(data1 && (data1.length > 0)) {
              item.senderName = data1[0]['displayName'],
              item.senderUrl = data1[0]['pictureUrl']
              this.allmessages.push(item);
            }
          },
          err => this.showError(err.message));

          
        });
      }

    
    },
     err => this.showError(err.message))

  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }

  scrollTo() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

/*
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
*/
}
