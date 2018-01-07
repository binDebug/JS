import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventsProvider } from '../../providers/events';
//import {EventPage} from '../../pages/event/event';

import "rxjs/add/operator/map";
import { event } from "../../models/event";
import { eventVM } from "../../models/eventVM";
import { Observable } from 'rxjs/Observable';
import { EventPage } from '../../pages/event/event';


@Component({
  selector: 'events-feed',
  templateUrl: 'events.html'
})
export class EventsComponent {

  text: string;
  eventList: event[];
  eventVMList: eventVM[];
  args:any =  {featured:true};

  constructor(
   
    public eventsService: EventsProvider,
    public navCtrl: NavController
  ) {
    
    this.eventsService.loaderShow();

     (this.eventsService.getEvents().valueChanges() as Observable< event[]>)
      .subscribe(data => {
        
          this.eventList = data;
          this.transform();
          this.eventsService.loaderHide();
      });
          
  }

  openEvent(event: Event) {
    var eventObj = {
      eventData: event
    };
    this.navCtrl.push(EventPage, eventObj);
  }
  
   transform() {
    if(this.eventList) {
      let vm : eventVM;

      this.eventVMList = [];

      this.eventList.forEach((item: event, index: number) => {
        if( (index % 2) === 0) {
            vm = new eventVM();
            vm.events = [];
            vm.events.push( item);
        }
        else {
            vm.events.push( item);
            this.eventVMList.push(vm);
        }
      });
      
      if(vm.events.length === 1)
        this.eventVMList.push(vm);

    }
  }

}
