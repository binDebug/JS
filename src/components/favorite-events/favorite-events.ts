import { OnInit, Component } from '@angular/core';
import { Events, NavController, ToastController } from 'ionic-angular';
import { event } from '../../models/event';
import { eventVM } from '../../models/eventVM';
import { EventsProvider } from '../../providers/events';
import { Observable } from 'rxjs/Observable';
import { EventPage } from '../../pages/event/event';

@Component({
  selector: 'favorite-events-feed',
  templateUrl: 'favorite-events.html',
})
export class FavoriteEvents implements OnInit {

  text: string;
  uid: string;
  userData: any;
  eventList: event[];
  favEventList: any[];
  eventVMList: eventVM[] = [];
  args:any =  {featured:true};
  isEventsLoaded : boolean = false;
  isFavEventsLoaded: boolean = false;
  
  
  constructor(
   
    public eventsService: EventsProvider,
    public navCtrl: NavController,
    private events: Events,
    private toastCtrl: ToastController
  ) {
      this.events.subscribe('event:favoriteEvent', () => this.getFavEvents());
      this.events.subscribe('event:unfavoriteEvent', () => this.getFavEvents());    
  }

  ngOnInit() {
    (this.eventsService.getEvents().valueChanges() as Observable< event[]>)
    .subscribe(data => {
        this.isEventsLoaded = true;
        this.eventList = data;
        this.transform();
    });
  
    this.userData = window.localStorage.getItem('userData');
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      this.getFavEvents();
    }   

  }

  private getFavEvents() {
    this.eventVMList = [];
    this.eventsService.getFavoritedEvents(this.uid).valueChanges()
    .subscribe(data => {
        this.isFavEventsLoaded = true;
        this.favEventList = data;
        this.transform();
      },
      err => this.showError(err.message));
  }

  private showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }

  openEvent(event: Event) {
    var eventObj = {
      eventData: event
    };
    this.navCtrl.push(EventPage, eventObj);
  }
  
  transform() {
    if((this.isEventsLoaded === true) && (this.isFavEventsLoaded === true)) {
     if(this.eventList && this.favEventList) {
       let vm : eventVM;
    
       this.favEventList.forEach((item: any, index: number) => {
         let event = this.eventList.find(p => p.id === item.eventid);
         if( (index % 2) === 0) {
             
             vm = new eventVM();
             vm.events = [];
             vm.events.push( event);
         }
         else {
             vm.events.push( event);
             this.eventVMList.push(vm);
         }
       });
       
       if((vm) && (vm.events.length === 1))
         this.eventVMList.push(vm);

     }
    
   }
 }

}
