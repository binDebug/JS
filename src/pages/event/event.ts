import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { EventsProvider } from '../../providers/events';
import {EventsComponent} from '../../components/events/events';

@Component({
  selector: 'page-event',
  templateUrl: 'event.html'
})
export class EventPage {

  constructor(public navCtrl: NavController, public events:EventsProvider) {
   
  }

}
