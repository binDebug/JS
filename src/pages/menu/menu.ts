import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
import { AuthProvider } from '../../providers/auth';

import { ChangePasswordPage } from '../change-password/change-password';
import { NotificationsSettingsPage } from '../notifications-settings/notifications-settings';
import { ReferencesPage } from '../references/references';
import { Events } from 'ionic-angular';
import { ResumeComponent } from '../../components/resume/resume';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage implements OnInit {

  userData: any;
  uid: string = null;
  resumeUrl: string = '';
  currentUser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
      private toastCtrl: ToastController,
      private auth: AuthProvider,
      private events: Events,
      private modalCtrl: ModalController
      ) {}

  ngOnInit() {
    this.currentUser = this.auth.getUser();
  }

ionViewDidLoad() {
  this.currentUser = this.auth.getUser();
}

  closeModal() {
    this.viewCtrl.dismiss();
  }

  changePassword() {
    this.navCtrl.push(ChangePasswordPage);
  }

  logOut() {
    this.auth.signOut()
      .then(data => {
        
        window.localStorage.removeItem('userData');
        this.events.publish('logout');
        this.navCtrl.setRoot(LoginPage);
      })
      .catch(err => this.showError(err.message));
    
  }

  notifications() {
    this.navCtrl.push(NotificationsSettingsPage);
  }

  references() {
    this.navCtrl.push(ReferencesPage);
  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }

  chat() {
 
  }

  profile() {
    this.navCtrl.push(ProfilePage);
  }

  uploadResume() {
    let modal = this.modalCtrl.create(ResumeComponent);
    modal.present();
  }
}
