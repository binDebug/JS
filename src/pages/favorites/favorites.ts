import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FavoriteJobsPage } from '../favorite-jobs/favorite-jobs';
import { FavoriteEventsPage } from '../favorite-events/favorite-events';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {

  public tab1: any = FavoriteJobsPage;
  public tab2: any = FavoriteEventsPage;

  constructor(public navCtrl: NavController) {

  }

}
