import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class FCMTokensProvider {

    constructor(private afDatabase: AngularFireDatabase) {
    }

    public getTokenForDevice(deviceid: string) {
      return this.afDatabase.list("fcmtokens", res => res.orderByKey().equalTo(deviceid));
    }


    public addTokenForDevice(deviceid: string, token: string) {
      var fcmToken = {
        token: token
      }
      return this.afDatabase.list("fcmtokens")
      .set(deviceid, fcmToken);
    }

    public updateTokenForDevice(deviceid: string, token: string) {
      var fcmToken = {
        token: token
      }
      return this.afDatabase.list("fcmtokens")
      .update(deviceid, fcmToken);
    }

    public removeTokenForDevice(deviceid: string) {
      
      return this.afDatabase.list("fcmtokens")
      .remove(deviceid);
    }

}
