import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { RegisterPage } from "../register/register";

import { TabsPage } from "../tabs/tabs";
import { AuthProvider } from '../../providers/auth';
import { Events } from 'ionic-angular/util/events';
import { AWSStorageProvider } from '../../providers/awsStorage';
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
      private storage: AWSStorageProvider,
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

//  goToRegister() {
//     this.navCtrl.setRoot(RegisterPage)
//   }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  login() {
    console.log('123');
    //this.storage.list();
    this.afAuth.signIn(this.email, this.password)
     .then(res => {
      this.navCtrl.setRoot(TabsPage);
      this.events.publish('login');
    }).catch(err => {

      let toast = this.toastCtrl.create({
        message: err.message,
        duration: 3000,
        position: 'bottom'
      });
    toast.present();
    });

  }
  isAuthenticated() {
  if(window.localStorage.getItem('userData')) {
    return true
  }
}
}
