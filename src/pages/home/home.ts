import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HeaderComponent} from '../../components/header/header';
import { JobsComponent } from '../../components/jobs/jobs';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
      private iab: InAppBrowser) {

  }

}
