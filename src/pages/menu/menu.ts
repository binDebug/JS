import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
import { AuthProvider } from '../../providers/auth';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
      private auth: AuthProvider) {}

  closeModal() {
    this.viewCtrl.dismiss()
  }

  logOut() {
    this.auth.signOut();
    window.localStorage.removeItem('userData');
    this.navCtrl.setRoot(LoginPage)
  }

  goToChat() {
 
  }

  profile() {
    this.navCtrl.push(ProfilePage);
  }
}
