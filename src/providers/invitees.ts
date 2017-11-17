import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class InviteesProvider {

  constructor( private afDatabase: AngularFireDatabase) {
     
 }

  getInvitee(email: string) {
      
    return this.afDatabase.list("/invitees", res => res.orderByChild('email').equalTo(email));
            
        
  }

}
