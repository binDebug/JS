import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database';

@Injectable()
export class UsersProvider {

  constructor(private afDatabase: AngularFireDatabase) {
     
 }

  getUser(uid: string) {
    return this.afDatabase.list("users", res => res.orderByKey().equalTo(uid) );
  }

  addUser(email: string, uid: string) {
      
      var user = {
          email: email
      };

      
      this.afDatabase.list("users").set(uid, user)
        .then(function (res: any) {
        });
        
    
  }
}
