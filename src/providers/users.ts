import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database';

@Injectable()
export class UsersProvider {

  constructor(private afDatabase: AngularFireDatabase) {
     
 }

  getLastUser(): AngularFireList<any[]> {
    return this.afDatabase.list("users", ref => ref.orderByKey().limitToLast(1));
  }

  addUser(email: string, id: number) {
      
      var user = {
          email: email
      };
this.afDatabase.list("users").set(id.toString(), user)
    .then(function (res: any) {
        
    });
    
  }
}
