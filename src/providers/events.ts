import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class EventsProvider {
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

    getEvents() {
        return this.afDatabase.list("events");
    }


    getEvent(eventid: string) {
        return this.afDatabase.list("events", res => res.orderByKey().equalTo(eventid));
    }

    isEventFavorited(uid: string, eventid: string) {
        let key: string = uid + '_' + eventid;
        return this.afDatabase.list("/favoritedevents", res => res.orderByKey().equalTo(key));
    }
    
    favoriteEvent(uid: string, eventid: string) {
        let item = {
            date : Date.now(),
            uid: uid,
            eventid: eventid
        };
        let key: string = uid + '_' + eventid;
        
        return this.afDatabase.list("/favoritedevents")
            .set(key, item);
    }
    
    unfavoriteEvent(key: string) {
    return this.afDatabase.list("/favoritedevents").remove(key);
    }

    getFavoritedEvents(uid: string) {
    return this.afDatabase.list("/favoritedevents", res => res.orderByChild("uid").equalTo(uid));
    }

    isEventApplied(uid: string, eventid: string) {
    let key: string = uid + '_' + eventid;
    return this.afDatabase.list("/registeredevents", res => res.orderByKey().equalTo(key));
    }

    getAppliedEvents(uid: string) {
    return this.afDatabase.list("/registeredevents", res => res.orderByChild("uid").equalTo(uid));
    }

    applyEvent(uid: string, eventid: string) {
    let item = {
        date : Date.now(),
        uid: uid,
        eventid: eventid
    };
    let key: string = uid + '_' + eventid;
    
    return this.afDatabase.list("/registeredevents")
        .set(key, item);
    }

    unApplyEvent(key: string) {
    return this.afDatabase.list("/registeredevents").remove(key);
    }
}
