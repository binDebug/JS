import { OnInit, Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { UsersProvider } from '../../providers/users';

@Component({
  selector: 'page-notifications-settings',
  templateUrl: 'notifications-settings.html',
})
export class NotificationsSettingsPage implements OnInit {

  notifications: boolean = false;
  userData: any;
  uid: string = '';
  constructor(public navCtrl: NavController, 
      public navParams: NavParams,
      private viewCtrl: ViewController,
      private toastCtrl: ToastController,
      private users: UsersProvider) {
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      this.users.getUser(this.uid).valueChanges()
        .subscribe(res => {
          if(res && (res.length > 0)) {
            let result : any[] = res;
            this.notifications = result[0].allowJobNotification;
          }
        },
        err => this.showError(err.message));
      }
    }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  save() {
    this.users.saveJobNotificationSettings(this.uid, this.notifications)
    .then(data => {})
    .catch(err => this.showError(err.message));
  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }

}
