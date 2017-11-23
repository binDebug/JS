import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { RegisterPage } from "../register/register";

import { TabsPage } from "../tabs/tabs";
import { AuthProvider } from '../../providers/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email:any;
  password:any;


  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private afAuth: AuthProvider,
      private toastCtrl: ToastController) {
  }

 goToRegister() {
    this.navCtrl.setRoot(RegisterPage)
  }

  login() {
    this.afAuth.signIn(this.email, this.password)
     .then(res => {
      console.log('res', res);
      let userData = {
        email: res.email,
        picture: res.photoURL,
        id: res.uid
      }
      window.localStorage.setItem('userData', JSON.stringify(userData))
      this.navCtrl.setRoot(TabsPage)
    }).catch(err => {

      let toast = this.toastCtrl.create({
        message: err.message,
        duration: 3000,
        position: 'bottom'
      });
    toast.present();
    })

  }
  isAuthenticated() {
  if(window.localStorage.getItem('userData')) {
    return true
  }
}
}
