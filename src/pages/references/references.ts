import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { UsersProvider } from '../../providers/users';

@Component({
  selector: 'page-references',
  templateUrl: 'references.html',
})
export class ReferencesPage implements OnInit {

  userData: any;
  uid: string = null;
  references: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private viewCtrl: ViewController,
      private toastCtrl: ToastController,
      private users: UsersProvider) {
  }
  
  ngOnInit() {
      this.userData = window.localStorage.getItem('userData');
      
      if(this.userData) {
        this.uid = JSON.parse(this.userData).id;
        this.users.getUser(this.uid).valueChanges()
          .subscribe(res => {
            if(res && (res.length > 0)) {
              let result : any[] = res;
              this.references = result[0].references;
            }
          },
        err => this.showError(err.message));
        }
      
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }

  save() {
    this.users.saveReferences(this.uid, this.references)
    .then(data => this.closeModal())
    .catch(err => this.showError(err.message));
  }

}
