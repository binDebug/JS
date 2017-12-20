import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
  private modalCtrl: ModalController) {
  }

  login() {
    console.log('1');
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }

  register() {
    console.log('2');
    let modal = this.modalCtrl.create(RegisterPage);
    modal.present();
  }
}
