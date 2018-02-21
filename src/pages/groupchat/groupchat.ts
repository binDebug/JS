import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { groupMessage } from '../../models/group-message';
import { GroupChatProvider } from '../../providers/groupChat';
import { UsersProvider } from '../../providers/users';
import { NotificationssProvider } from '../../providers/notifications';
import { GroupsProvider } from '../../providers/groups/groups';

@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
})

export class GroupchatPage implements OnInit{

  public groupName: string = '';
  public groupId: string = '';
  public userData: any;
  public uid: string = null;
  public newmessage: string = '';
  public allmessages = [];
  private members = [];
  public pictureUrl: string;
  public name: string;
  @ViewChild('content') content: Content;

  constructor(public navCtrl: NavController, 
    private notificationsService: NotificationssProvider,
    public navParams: NavParams, 
    private groupChatService: GroupChatProvider,
    private groupService: GroupsProvider,
    private userService: UsersProvider,
    private toastCtrl: ToastController) {
      this.groupName = this.navParams.get('groupName');
      this.groupId = this.navParams.get('groupId');
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;

      this.userService.getUser(this.uid).valueChanges()
      .subscribe(data => {
        let result : any[] = data;
        if(result && (result.length > 0)) {
          this.pictureUrl = result[0].pictureUrl;
          this.name = result[0].displayName;
          
      this.getMessages();

        }
      },
      err => this.showError(err.nessage));

      this.groupService.getGroupMembers(this.groupId)
      .valueChanges().subscribe(data => {
        if(data && (data.length > 0)) {
          this.members = data;
          let item = this.members.find(p => (p.uid === this.uid) && (p.groupid === this.groupId));

          if(item) {
            let index = this.members.indexOf(item);

            if(index >= 0) {
              this.members.splice(index, 1);
          }

        }
        }
      }, err => this.showError(err.message));
      
    }
  }


  getMessages() {
    
    this.groupChatService.getMessages(this.groupId).valueChanges() 
    .subscribe(data => {
      if(data && (data.length > 0)) {
        this.allmessages = [];
        for(var key in data[0]) {
          
          this.process(data[0][key], key);
        }
      }
    }, err=> this.showError(err.message));
  }
 
  process (element, i) {
    //let element = e[i];
    
    let obj = this.allmessages.find(p => p.timeStamp === i);
    if(obj) {
      return;
    }
    
    let item = {
      sender: element.sender,
      message: element.message,
      timeStamp: i,
      attachment:  element.attachment,
      senderName: '',
      senderUrl: ''
    };
    
    if(item.sender === this.uid) {
      item.senderName = this.name;
      item.senderUrl = this.pictureUrl;
        this.allmessages.push(item);
      
      this.sort();
      
    } else {
      this.userService.getUser(item.sender).valueChanges()
      .subscribe(data1 => {
        if(data1 && (data1.length > 0)) {
          item.senderName = data1[0]['displayName'],
          item.senderUrl = data1[0]['pictureUrl']
          let obj = this.allmessages.find(p => p.timeStamp === item.timeStamp);
            this.allmessages.push(item);
    
          this.sort();
        }
      }, err => this.showError(err.message));
    }
    
  }

  sort() {
    this.allmessages.sort(function(a,b) {
      return b.timeStamp - a.timeStamp;
    } ); 
  }

  addMessage() {
    if(this.newmessage.trim() === '')
      return;

    let message = {
      sender: this.uid,
      message: this.newmessage,
      timeStamp: Date.now(),
      groupId: this.groupId,
      attachment: false
    } as groupMessage;

    this.groupChatService.saveMessage(message)
    .then(data => {
      this.members.forEach((element, index) => {
        this.notificationsService.add(element.uid, Math.random().toString().replace('.', ''),
              'Group chat message', 'New message on the group: ' + this.groupName, 'group',
              null, null, this.groupId)
              .then(data => {})
              .catch(err => this.showError(err.message));
      });
      this.newmessage = '';
    })
    .catch(err => this.showError(err.message));
  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }
}
