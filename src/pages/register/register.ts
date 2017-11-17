import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import { TabsPage } from "../tabs/tabs";
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  email: any;
  password: any;
  userAdded: boolean = true;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private toastCtrl: ToastController,
     private afAuth: AngularFireAuth) {
  }

    register() {

    //let res = this.invitees.getInvitee(this.email);
      //  if (res ) {
          this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
          .then(res => {

            let userData = {
              email: res.email,
              picture: res.photoURL,
              id: res.uid
            }
            window.localStorage.setItem('userData', JSON.stringify(userData));

            this.userAdded = false;
            this.addUser(this.email);

            this.navCtrl.setRoot(TabsPage);
          }).catch(err => {

            this.showError(err.message);
          })
        //}
        //else {
         // this.showError('You need an invitation to register.');
        //}
      

  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }

  addUser(email: any) {
    let id: number = 0;

    // let res = this.users.getLastUser();
    //     if(res ) {
    //       id = +res[0].$key + 1;
    //       console.log(id);
    //     }

    //     if(this.userAdded == false) {
    //       this.users.addUser(email, id);
    //       this.userAdded = true;
    //     }
  }


}
