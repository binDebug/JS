import { Component, OnInit } from '@angular/core';
import { NotificationssProvider } from '../../providers/notifications';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { JobPage } from '../../pages/job/job';
import { JobsProvider } from '../../providers/jobs';
import { EventsProvider } from '../../providers/events';
import { EventPage } from '../../pages/event/event';
import { TabsPage } from '../../pages/tabs/tabs';
import { ContactsPage } from '../../pages/contacts/contacts';

@Component({
  selector: 'notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsComponent implements OnInit {

  notifsList : any[];
  userData: any;
  uid: string = null;

  constructor(private notifs: NotificationssProvider,
            private navCtrl: NavController,
            private viewCtrl: ViewController,
            private jobs: JobsProvider,
            private events: EventsProvider,
            private toastCtrl: ToastController) {
   
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      if(this.uid)
      this.notifs.get(this.uid).valueChanges()
      .subscribe(data => this.notifsList = data,
      err => this.showError(err.message));
      
    }

  }

  dismiss(item : any) {
    this.notifs.remove(this.uid, item.notificationid)
       .catch(err => this.showError(err.message));
  }


  navigate(item : any) {
    if(item.jobid) {
      let jobData: any;

      this.viewCtrl.dismiss();
      this.jobs.getJob(item.jobid).valueChanges()
      .subscribe(data => {
        
        if(data && (data.length > 0)) {
          jobData = data[0];
          this.dismiss(item);
          this.navCtrl.setRoot(TabsPage);
          this.navCtrl.push(JobPage, { jobsData: jobData});
        }
      },
    err => this.showError(err.message));
      
    }
    else if(item.eventid) {
      let eventData : any;

      this.viewCtrl.dismiss();
      this.events.getEvent(item.eventid).valueChanges()
      .subscribe(data => {
        if(data && (data.length > 0)) {
          eventData = data[0];
          this.dismiss(item);
          this.navCtrl.setRoot(TabsPage);
          this.navCtrl.push(EventPage, { eventData : eventData });
        }
      },
    err => this.showError(err.message));
    }
    else if (item.type === 'contact') {
      
      this.dismiss(item);
      this.navCtrl.setRoot(TabsPage);
      this.navCtrl.push(ContactsPage);
    }
    
  }

  closeModal() {
    this.viewCtrl.dismiss();
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
