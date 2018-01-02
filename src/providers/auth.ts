 import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthProvider {
    currentUser: any;
  constructor( private afAuth: AngularFireAuth) {
     
 }

 signUp(email: string, password: string) : Promise<any> {
    let promise = new Promise((resolve, reject) => {
         this.afAuth.auth.createUserWithEmailAndPassword(email, password)
         .then(res => {
           let userData = {
                email: res.email,
                picture: res.photoURL,
                id: res.uid
            }
            window.localStorage.setItem('userData', JSON.stringify(userData));
            this.currentUser = res;
            resolve(res);
            }).catch(err => reject(err))
        });

    return promise;
}

signIn(email: string, password: string) {
    
    let promise = new Promise((resolve, reject) => {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(res => {
        let userData = {
          email: res.email,
          picture: res.photoURL,
          id: res.uid
        }
        this.currentUser = res;
        window.localStorage.setItem('userData', JSON.stringify(userData))
        resolve(res);
      })
      .catch(err => reject(err));
    });
    return promise;
}

changePassword(email: string, oldPassword: string, newPassword: string) {
    console.log(email, oldPassword, newPassword);
    let promise = new Promise((resolve, reject) => {
        console.log('1');
        this.signIn(email, oldPassword)
        .then(data => {
            console.log('2', data);
            this.afAuth.auth.currentUser.updatePassword(newPassword)
            .then(data => resolve(data))
            .catch(err => reject(err));
        })
        .catch(err => {
            err.code = 'incorrect password';
            reject(err);
        });
    });

    return promise;
}

public getUser() {
    if(!this.currentUser)
        this.currentUser = this.afAuth.auth.currentUser;

    return this.currentUser;
}

public isUserValid() {
    return this.afAuth.auth.currentUser != null;
}

public updateEmail(email: string) {
    return this.afAuth.auth.currentUser.updateEmail(email);
}


public updateName(name: string) {
    let url : string = this.afAuth.auth.currentUser.photoURL;
    let profile = {
        displayName: name,
        photoURL: url};
        
    return this.afAuth.auth.currentUser.updateProfile( profile);
}

public setPhoto(photoUrl: string) {
    let name : string = this.afAuth.auth.currentUser.displayName;
    let profile = {
        displayName: name,
        photoURL: photoUrl};
    return this.afAuth.auth.currentUser.updateProfile(profile);
}

public updatePassword(newPassword: string) {
    this.afAuth.auth.currentUser.updatePassword(newPassword);
    
}

public signOut() {
    return this.afAuth.auth.signOut();
    
}

public forgotPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
}
}
