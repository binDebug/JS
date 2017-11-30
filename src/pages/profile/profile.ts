import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users';
import { AuthProvider } from '../../providers/auth';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage implements OnInit {
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private users: UsersProvider,
    private auth: AuthProvider
    ) {
    }
    userData: any;
    uid: string = null;
    resumeUrl: string = '';
    currentUser: any;
    isNameEditing = false;
    isEmailEditing = false;
    isPhoneEditing = false;
    isZipEditing = false;
    name: string = '';
    email: string = '';
    phone: string = '';
    zip: string = '';

    ngOnInit() {
      this.userData = window.localStorage.getItem('userData');
      
      if(this.userData) {
        this.uid = JSON.parse(this.userData).id;
        this.users.getUser(this.uid).valueChanges()
          .subscribe(res => {
            if(res && (res.length > 0)) {
              let result : any[] = res;
              this.resumeUrl = result[0].resumeUrl;
              this.phone = result[0].phone;
            }
          });
          this.currentUser = this.auth.getUser();
      
          if(this.currentUser.displayName)
          this.name = this.currentUser.displayName.trim();
          
          if(this.currentUser.email)
          this.email = this.currentUser.email.trim();
          
       }
    }

    saveName() {
      this.auth.updateName(this.name.trim())
      .then(data => {this.isNameEditing = false;})
      .catch(err => this.showError(err.message)) ;
      
      
    }

    saveEmail() {
      
      this.auth.updateEmail(this.email.trim())
      .then(data => {
        this.currentUser = this.auth.getUser();
        this.email = this.currentUser.email.trim();
        this.users.updateEmail(this.uid, this.email)
        .then(() => this.isEmailEditing = false)
        .catch(err => this.showError(err.message));
      })
      .catch(err => {
        this.showError(err.message);
        this.email = this.currentUser.email.trim();
        this.isEmailEditing = false;
      }) ;
      
      
    }

    savePhone() {
      this.users.updatePhone(this.uid, this.phone.trim())
      .then(data => { this.isPhoneEditing = false;})
      .catch(err => this.showError(err.message)) ;
      
    }

    saveZip() {
      this.users.updateZip(this.uid, this.zip.trim())
      .then(data => { this.isZipEditing = false;})
      .catch(err => this.showError(err.message)) ;
      
    }

    closeModal() {
      this.viewCtrl.dismiss()
    }
  
  
    showError(message: string) {
      let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
          });
      toast.present();
    }

   
}    