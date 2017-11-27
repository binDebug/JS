import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { EventsProvider } from '../../providers/events';
import {EventsComponent} from '../../components/events/events';

@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {

  constructor(public navCtrl: NavController, public events:EventsProvider) {
   
  }

}
