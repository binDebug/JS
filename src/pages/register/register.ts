import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { TabsPage } from "../tabs/tabs";
//import { LoginPage } from "../login/login";
import {InviteesProvider} from '../../providers/invitees';
import {UsersProvider} from '../../providers/users';
import { AuthProvider } from '../../providers/auth';
import { ViewController } from 'ionic-angular/navigation/view-controller';


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
     private viewCtrl: ViewController,
     private toastCtrl: ToastController,
     private afAuth: AuthProvider,
     private invitees: InviteesProvider,
     private users: UsersProvider) {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

    register() {
   
    this.invitees.getInvitee(this.email).snapshotChanges().subscribe(res => {
       if (res && (res.length == 1)) {
         this.afAuth.signUp(this.email, this.password)
          .then(res => {

            this.userAdded = false;
            this.addUser(this.email.toLowerCase(), res.uid);

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

  addUser(email: string, uid: string) {
    if(this.userAdded == false) {
    let id: number = 0;


        this.users.addUser(email, uid);
        this.userAdded = true;

    }
  }

}
