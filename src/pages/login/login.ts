import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RegisterPage } from "../register/register";

import {AngularFireAuth} from 'angularfire2/auth';
import { TabsPage } from "../tabs/tabs";

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
      private afAuth: AngularFireAuth,
      private toastCtrl: ToastController) {
  }

 goToRegister() {
    this.navCtrl.setRoot(RegisterPage)
  }

  login() {
     this.afAuth.auth.signInWithEmailAndPassword(
      this.email,
      this.password
    ).then(res => {
        
      let userData = {
        email: res.email,
        picture: res.photoURL,
        uid: res.uid
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
