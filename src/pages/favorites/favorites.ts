import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FavoriteJobs } from '../../components/favorite-jobs/favorite-jobs';
import { FavoriteEvents } from '../../components/favorite-events/favorite-events';
import {HeaderComponent} from '../../components/header/header';
import { Observable } from 'rxjs/Observable';
import { event } from '../../models/event';
import { eventVM } from '../../models/eventVM';
import { EventsProvider } from '../../providers/events';
import { EventPage } from '../event/event';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {

  title: string = "Favorite Jobs";
  showJobs: boolean = true;

  constructor(public navCtrl: NavController,
    public eventsService: EventsProvider) {

  }
    
  showContent() {
    this.showJobs = !this.showJobs;

    if(!this.showJobs)
      this.title = "Favorite Events";
  }

 
}
