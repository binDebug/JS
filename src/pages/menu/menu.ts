import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
/*

  Generated class for the Menu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    }

  closeModal() {
    this.viewCtrl.dismiss()
  }

  logOut() {
    window.localStorage.removeItem('userData');
    this.navCtrl.setRoot(LoginPage)
  }

  goToChat() {
 
  }

  profile() {
    this.navCtrl.push(ProfilePage);
  }
}
