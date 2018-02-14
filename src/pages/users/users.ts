import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users';
import { RequestsProvider } from '../../providers/requests/requests';
import { contactRequest } from '../../models/contactRequest';
import { user } from '../../models/user';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { NotificationssProvider } from '../../providers/notifications';

@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  newrequest = {} as contactRequest;
  temparr = [];
  filteredusers:user[]  = [];
  searchstring: string;
  userData: any;
  uid: string = null;
  imgUrl: string = null;
displayName: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public userService: UsersProvider,
    public alertControl: AlertController,
    private notificationsService: NotificationssProvider,
    public requestService: RequestsProvider) {
      
    
  }

  ionViewDidEnter() {
    this.userService.getAllUsers().valueChanges()
     .subscribe((res: any) => {
      this.filteredusers = res;
      this.temparr = res;
    },
    err => this.showError(err.message));

    this.userData = window.localStorage.getItem('userData');
    
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      this.userService.getUser(this.uid)
      .valueChanges().subscribe(data => {
        if(data && data.length > 0 ) {
          this.imgUrl = data[0]['pictureUrl'];
          this.displayName = data[0]['displayName'];
          }
      },
    err => this.showError(err.message));
    }
  }

  searchUser(searchbar) {
    this.filteredusers = this.temparr;
    var q = searchbar.target.value;
    this.searchstring = searchbar.target.value;

    if (q.trim() == '') {
      return;
    }

    this.filteredusers = this.filteredusers.filter((v) => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }

  sendRequest(recipient) {
    //this.newrequest = {};
    this.newrequest.sender = this.uid;
    this.newrequest.recipient = recipient.id;
    if(this.imgUrl) {
      this.newrequest.senderImgUrl = this.imgUrl;
    }
    this.newrequest.senderName = recipient.displayName;

    if (this.newrequest.sender === this.newrequest.recipient)
      this.showError('You cannot add yourself to your contact list.');
    else {
      this.requestService.sendContactRequest(this.newrequest).then((res: any) => {
          this.showError('Your request was sent to ' + recipient.displayName);
      
          let sentuser = this.filteredusers.indexOf(recipient);
          this.filteredusers.splice(sentuser, 1);
 
          this.notificationsService.add(recipient.id, Math.random().toString().replace('.', ''), 'New contact request', 
          'You have a friend request from: ' + this.displayName, 'contact', null, null)
          .catch(err =>  this.showError(err.message));
      })
      .catch((err) => this.showError(err.message));
    }
  }

}
