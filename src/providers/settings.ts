import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class SettingsProvider {

    constructor(private afDatabase: AngularFireDatabase) {
    }

    public settingsList() {
      return this.afDatabase.list("settings");
    }

    public aws() {
      return this.afDatabase.list("settings", res => res.orderByKey().equalTo("AWS"));
    }

}
