import { Component, OnInit } from '@angular/core';

import { FavoritesPage } from '../favorites/favorites';
import { HomePage } from '../home/home';
import { EventsPage } from '../events/events';

import { NavController } from 'ionic-angular';
import { LandingPage } from '../landing/landing';
import { AppliedPage } from '../applied/applied';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {

  tab1Root = HomePage;
  tab2Root = EventsPage;
  tab3Root = FavoritesPage;
  tab4Root = AppliedPage;

  userData: any;
  uid: string;
  constructor(public navCtrl: NavController) {

  }

  ngOnInit() {
    
  }

  ionViewCanEnter() {
    let user: any = null;
    this.userData = window.localStorage.getItem('userData');
    
    for(let i = 0; i < window.localStorage.length; i++) {
      if(window.localStorage.key(i).startsWith('firebase:authUser')) {
          user = window.localStorage.getItem(window.localStorage.key(i));
          break;
      }
    }
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
    }
    
    if(this.uid && user)
      return true;
    else {
      this.navCtrl.setRoot(LandingPage);
      return true;
    }
  }
}
