import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { MenuPage } from '../../pages/menu/menu';
import { Events } from 'ionic-angular/util/events';
import { NotificationssProvider } from '../../providers/notifications';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { NotificationsComponent } from '../notifications/notifications';

/*
  Generated class for the Header component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'header-component',
  templateUrl: 'header.html'
})
export class HeaderComponent implements OnInit {
  @Input() title : string; 
  text: string;
  unreadNotificationCount: number = 0;
  notificationsList: any[];
  unreadnotificationsList: any[];
  
  userData: any;
  uid: string = null;
  

  constructor(public modalCtrl: ModalController,
  private events: Events,
  private notifications: NotificationssProvider,
  private toastCtrl: ToastController) {
    
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      if(this.uid)
        this.getNotifications();
    }
    
    this.events.subscribe('notification:received',() => this.getNotifications());
  }

  getNotifications() {
    
    this.notifications.get(this.uid).valueChanges()
    .subscribe(data => {
        this.notificationsList = data;
        this.unreadnotificationsList = this.notificationsList.filter(p => p.isViewed === false);
        this.unreadNotificationCount = 0; 
        let uniqueChats = [];
        this.unreadnotificationsList.forEach(element => {
          if(element.chatid) {
            let item = uniqueChats.find(p => p.chatid === element.chatid);
            if(!item) {
              uniqueChats.push(element);
            }
          }
          else {
            uniqueChats.push(element);
          }
        });
        this.unreadNotificationCount = uniqueChats.length;
        //this.unreadnotificationsList.length;
    }
    ,err => this.showError(err.message));
  }


  showError(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
  toast.present();
  }

  showNotifications() {
    if(this.unreadnotificationsList && (this.unreadnotificationsList.length > 0)) {
      this.unreadnotificationsList.forEach(item => {
        this.notifications.updateViewed(this.uid, item.notificationid, true)
        .then(data => this.unreadNotificationCount = 0)
        .catch(err => this.showError(err.message));
     
      });
    }
    this.presentModal();

    

  }

  presentModal() {
    let modal = this.modalCtrl.create(NotificationsComponent);
    modal.present();
  }

public presentMenu() {
  let modal = this.modalCtrl.create(MenuPage);
  modal.present();
}

}
