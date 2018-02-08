import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { TabsPage } from "../tabs/tabs";
import { AuthProvider } from '../../providers/auth';
import { Events } from 'ionic-angular/util/events';
import { ViewController } from 'ionic-angular/navigation/view-controller';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage{

  email:any;
  password:any;
  userData: any;
  uid: string = null;


  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private viewCtrl: ViewController,
      private afAuth: AuthProvider,
      private toastCtrl: ToastController,
      private events: Events) {
        
        
  }


ionViewCanEnter() {
  let user: any = null;
  this.userData = window.localStorage.getItem('userData');
  
  for(let i = 0; i < window.localStorage.length; i++) {
    if(window.localStorage.key(i).startsWith('firebase:authUser')) {
        user = window.localStorage.getItem(window.localStorage.key(i));
        break;
    }
  }
  if(this.userData) {
    this.uid = JSON.parse(this.userData).id;
  }
  
  if(this.uid && user) {
    this.navCtrl.setRoot(TabsPage);
    return true;
  }
  else 
    return true;
  
}

  closeModal() {
    this.viewCtrl.dismiss();
  }

  login() {
    this.afAuth.signIn(this.email, this.password)
     .then(res => {
      this.navCtrl.setRoot(TabsPage);
      this.events.publish('login');
    }).catch(err => this.showError(err.message));

  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
  toast.present();
  }
  isAuthenticated() {
    if(window.localStorage.getItem('userData')) {
      return true
    }
  }

  forgotPassword() {
    if(!this.email) {
      this.showError("Enter email");
    }
    else {
      this.afAuth.forgotPassword(this.email)
      .then(data => this.showError('An email has been sent to your email address. Use the link in the email to reset password.'))
      .catch(err => this.showError(err.message));
    }
  }
}
