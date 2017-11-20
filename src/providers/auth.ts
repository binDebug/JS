 import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthProvider {
  constructor( private afAuth: AngularFireAuth) {
     
 }
signUp(email: string, password: string) : Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(
        email,
        password
      );
}

signIn(email: string, password: string) : Promise<any>{
    return  this.afAuth.auth.createUserWithEmailAndPassword(email, password);
}


}
