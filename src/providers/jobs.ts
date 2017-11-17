import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class JobsProvider {
 public jobs: any;
 public loaderState:boolean;
  constructor(private afDatabase: AngularFireDatabase) {
    

 this.loaderState = true
 
  }

 
loaderShow() {
this.loaderState = true;
}

loaderHide() {
this.loaderState = false;
}


  getFirebaseJobs() {
 
   return this.afDatabase.list("/jobs")

    

  }

}
