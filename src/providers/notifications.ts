import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class NotificationssProvider {

    constructor(private afDatabase: AngularFireDatabase) {
    }

    public add(userid: string, notificationid: string, title: string, body: string, type: string, jobid: string, eventid: string) {
      let key = userid + "_" + notificationid;
      let notification = {
        userid: userid,
        notificationid: notificationid,
        title: title,
        body: body,
        date: Date.now(),
        type: type,
        jobid: jobid,
        eventid: eventid,
        isViewed: false,
        isVisited: false
      };
      return this.afDatabase.list("notifications")
      .set(key, notification);
    }

    public get(userid: string) {
      return this.afDatabase.list("notifications", res => res.orderByChild("userid").equalTo(userid));
    }

    public updateViewed(userid : string, notificationid: string, isViewed: boolean) {
      let data = {
        isViewed: isViewed
      };
      let key: string = userid + "_" + notificationid;
      return this.afDatabase.list("notifications")
      .update(key, data);
    }

    public remove(userid : string, notificationid: string) {
      
      let key: string = userid + "_" + notificationid;
      return this.afDatabase.list("notifications")
      .remove(key);
  }
}
