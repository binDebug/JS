import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users';
import { RequestsProvider } from '../../providers/requests/requests';
import { contactRequest } from '../../models/contactRequest';
import { user } from '../../models/user';
import firebase from 'firebase';

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  newrequest = {} as contactRequest;
  temparr = [];
  filteredusers:user[]  = [];
  searchstring: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public userservice: UsersProvider, public alertControl: AlertController,
    public requestservice: RequestsProvider) {
      console.log("UsersPage Ctor");
    this.userservice.getallusers().then((res: any) => {
      console.log(res);
      this.filteredusers = res;
      this.temparr = res;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
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

  sendRequest(recipient) {
    this.newrequest.sender = firebase.auth().currentUser.uid;
    console.log(this.newrequest.sender);
    console.log(recipient.uid + ' - incoming recipient');
    this.newrequest.recipient = recipient.uid;
    console.log(this.newrequest.recipient + ' - is the recipient');
    if (this.newrequest.sender === this.newrequest.recipient)
      alert('You are your friend always');//TODO: Disable SendRequest option on HTML.
    else {
      let successalert = this.alertControl.create({
        title: 'Request sent',
        subTitle: 'Your request was sent to ' + recipient.displayName,
        buttons: ['ok']
      });

      this.requestservice.sendRequest(this.newrequest).then((res: any) => {
        if (res.success) {
          successalert.present();
          let sentuser = this.filteredusers.indexOf(recipient);
          this.filteredusers.splice(sentuser, 1);
        }
      }).catch((err) => {
        alert(err);
      })
    }
  }

}
