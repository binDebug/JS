import { Input, OnInit, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { event } from '../../models/event';
import { eventVM } from '../../models/eventVM';
import { EventsProvider } from '../../providers/events';
import { Observable } from 'rxjs/Observable';
import { EventPage } from '../event/event';

@Component({
  selector: 'page-favorite-events',
  templateUrl: 'favorite-events.html',
})
export class FavoriteEventsPage implements OnInit {

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
    public navCtrl: NavController
  ) {
    
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
    this.eventsService.getFavoritedEvents(this.uid).valueChanges()
    .subscribe(data => {
        this.isFavEventsLoaded = true;
        this.favEventList = data;
        this.transform();
      });
    }   
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
    
       this.favEventList.forEach((item: event, index: number) => {
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
