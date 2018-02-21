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
import { ContactchatsPage } from '../../pages/contactchats/contactchats';
import { GroupsProvider } from '../../providers/groups/groups';
import { GroupchatPage } from '../../pages/groupchat/groupchat';

@Component({
  selector: 'notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsComponent implements OnInit {

  notifsList = [];
  userData: any;
  uid: string = null;

  constructor(private notifs: NotificationssProvider,
            private navCtrl: NavController,
            private viewCtrl: ViewController,
            private jobs: JobsProvider,
            private groupService: GroupsProvider,
            private events: EventsProvider,
            private toastCtrl: ToastController) {
   
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      if(this.uid)
        this.notifs.get(this.uid).valueChanges()
        .subscribe(data => this.processNotifications(data),
        err => this.showError(err.message));
      
    }

  }

  processNotifications(notifs) {
    
    if (notifs && (notifs.length > 0)) {
      notifs.forEach(element => {
        if ((element.type === 'chat') || (element.type === 'group')) {
          let item = this.notifsList.find(p => p.chatid === element.chatid);
          
          if(!item) {
            this.notifsList.push(element);
          } else {
            this.dismiss(element);
          }
        } else {
          this.notifsList.push(element);
        }  
      }); 
        
      
    }
  }

  dismiss(item : any) {
    
    this.notifs.remove(this.uid, item.notificationid)
        .then(data => {
          let index = this.notifsList.indexOf(item);
    
          if(index >= 0) {
            this.notifsList.splice(index, 1);
          }
        })
       .catch(err => this.showError(err.message));
  }


  navigate(item : any) {
    
    if(item.chatid) {
      if (item.type === 'chat') {
        this.dismiss(item);
    
        let ids = item.chatid.split('_');
        let data = {
          contactData: {
            id1: ids[0],
            id2: ids[1]
          }
        }; 
        this.navCtrl.push(ContactchatsPage, data);
      }

      else if (item.type === 'group') {
        this.dismiss(item);
    
        let groupId = item.chatid;
        this.groupService.getGroup(groupId).valueChanges()
        .subscribe(data1 => {
          if(data1 && (data1.length > 0)) {
            let data = {
              groupName: data1[0]['name'],
              groupId: groupId
        
            };
            
            this.navCtrl.push(GroupchatPage, data);
          }
        }, err => this.showError(err.message));


      }
    }
    else if(item.jobid) {
      let jobData: any;

      this.dismiss(item);
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

      this.dismiss(item);
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
