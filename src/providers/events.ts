 import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { event } from '../models/event';

@Injectable()
export class EventsProvider {



 //public events: any;
 public loaderState:boolean;

  constructor( private afDatabase: AngularFireDatabase) {
     this.loaderState = true
 }

loaderShow() {
    this.loaderState = true;
}

loaderHide() {
    this.loaderState = false;
}


  getFirebaseEvents() : AngularFireList<event[]>{
     return this.afDatabase.list("events");
  }

}
