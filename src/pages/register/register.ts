import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
//import {AngularFireList} from 'angularfire2/database';
import { TabsPage } from "../tabs/tabs";
import { LoginPage } from "../login/login";
import {InviteesProvider} from '../../providers/invitees';
import {UsersProvider} from '../../providers/users';


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
     private afAuth: AngularFireAuth,
     private invitees: InviteesProvider,
     private users: UsersProvider) {
  }

    register() {

    this.invitees.getInvitee(this.email).snapshotChanges().subscribe(res => {
       if (res && (res.length == 1)) {
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
        }
        else {
         this.showError('You need an invitation to register.');
        }
      
      });
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
    if(this.userAdded == false) {
    let id: number = 0;

      this.users.getLastUser().snapshotChanges().subscribe(data=> {
        if(data && (data.length == 1)) {
          id = +data[0].key + 1;
          
        }
        this.users.addUser(email, id);
        this.userAdded = true;
      });
    }
  }

  login() {
    this.navCtrl.setRoot(LoginPage);
  }
}
