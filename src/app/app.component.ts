import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import { TabsPage } from '../pages/tabs/tabs';
import { FCMTokensProvider } from '../providers/fcmtokens';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { NotificationssProvider } from '../providers/notifications';
import { UsersProvider } from '../providers/users';

import { UsersPage } from '../pages/users/users';
import { ContactsPage } from '../pages/contacts/contacts';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
 rootPage:any = TabsPage;
  //rootPage:any = ContactsPage;
  deviceId: string = null;
  token: string = null;
  userData: any;
  uid: string = null;
  allowJobNotification: boolean = false;
  
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private tokens: FCMTokensProvider,
    private toastCtrl: ToastController,
    private notifications: NotificationssProvider,
    private users: UsersProvider,
    private fcm: FCM, 
    private events: Events,
    private uuid: UniqueDeviceID) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.events.subscribe('login', () => this.setUserId() );
      this.events.subscribe('logout', () => this.logout() );
      
      this.setUserId();
      
  })
  .catch(err => this.showError(err.message));
  }

  setUserId() {
    this.userData = window.localStorage.getItem('userData');
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      if(this.uid) {
        this.users.updateDeviceId(this.uid, this.deviceId)
        .catch(err => this.showError(err.message));

        this.users.getUser(this.uid).valueChanges()
        .subscribe(res => {
          if(res && (res.length > 0)) {
            let result : any[] = res;
            this.allowJobNotification = result[0].allowJobNotification;
            //if(this.allowJobNotification)
              this.setNotifications();
          }},
          err => this.showError(err.message));
        
      }
    }

  }

  logout() {
    if(this.uid)
      this.users.updateDeviceId(this.uid, "")
      .catch(err => this.showError(err.message));

    this.tokens.removeTokenForDevice(this.deviceId)
    .then(data => { 
       this.uid = '';
       this.fcm.onNotification().subscribe(() => {});
    })
    .catch(err => this.showError(err.message));
  }

  setNotifications() {
    this.uuid.get().then(data => {
      this.deviceId = data;

      this.fcm.getToken()
    .then(token => {
      // save this server-side and use it to push notifications to this device
      this.token = token;
      this.setToken();
      console.log(`Obtained token: ${token}`);
 
    })
    .catch( error => {
      console.error(`Error: ${error}`);
    });

    this.fcm.onTokenRefresh()
    .subscribe(token => {
      // save this server-side and use it to push notifications to this device
      this.token = token;
      this.updateToken();
      console.log(`Refreshed token: ${token}`);
    },
    error => {
      console.error(`Error: ${error}`);
    });

    if(this.allowJobNotification === true) {
      this.fcm.onNotification()
      .subscribe(notification => {
        // check notification contents and react accordingly
        this.notifications.add(this.uid, notification.notificationid,
          notification.title, notification.body, notification.type, 
          notification.jobid, notification.eventid, notification.chatid)
        .then(data => {
          
          this.events.publish('notification:received');
        })
        .catch(err => this.showError(err.message));
        
    }, 
    error =>  {
      console.error(`Error: ${error}`);
    });
  }
  });

  }
  setToken() {
    if(this.deviceId && this.token) 
      this.tokens.addTokenForDevice(this.deviceId, this.token)
      .catch(err => this.showError(err.message));
      
    if(this.uid)
      this.users.updateDeviceId(this.uid, this.deviceId)
      .catch(err => this.showError(err.message));
  }

  updateToken() {
    if(this.deviceId && this.token) 
      this.tokens.updateTokenForDevice(this.deviceId, this.token)
      .catch(err => this.showError(err.message));

    if(this.uid)
      this.users.updateDeviceId(this.uid, this.deviceId)
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
