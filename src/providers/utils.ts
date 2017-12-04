import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class UtilProvider {

    constructor(private afDatabase: AngularFireDatabase) {
    }

    public countriesList() {
      return this.afDatabase.list("countries");
    }

    public educationList() {
      return this.afDatabase.list("education");
    }

    public experienceList() {
      return this.afDatabase.list("experience");
    }

    public industryList() {
      return this.afDatabase.list("industries");
    }

    public salaryList() {
      return this.afDatabase.list("salary");
    }

}
