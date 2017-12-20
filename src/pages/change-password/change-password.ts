import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { LandingPage } from '../landing/landing';

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  currentPassword : string = '';
  newPassword : string = '';
  confirmNewPassword : string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private viewCtrl: ViewController,
      private auth: AuthProvider,
      private toastCtrl: ToastController) {
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  private showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }

  changePassword() {
    let currentUser = this.auth.currentUser;
    if(this.newPassword === this.confirmNewPassword) {
      this.auth.changePassword(currentUser.email, this.currentPassword, this.newPassword )
      .then(data => {
        console.log('data', data);
        this.viewCtrl.dismiss();
      })
      .catch(err => {
        if(err.code === 'incorrect password') {
          this.auth.signOut();
          this.navCtrl.setRoot(LandingPage);
        }
        this.showError(err.message);
      });
    }
    else {
      this.showError("New password and Confirm new password do not match");
    }
  }
  
}
