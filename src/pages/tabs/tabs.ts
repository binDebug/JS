import { Component } from '@angular/core';

import { FavoritesPage } from '../favorites/favorites';
import { HomePage } from '../home/home';
import { EventsPage } from '../events/events';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = EventsPage;
  tab3Root = FavoritesPage;

  constructor() {

  }
}
