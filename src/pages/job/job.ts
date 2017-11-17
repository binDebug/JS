import { Component } from '@angular/core';
import { NavController, NavParams,ToastController } from 'ionic-angular';
import { JobsProvider } from '../../providers/jobs';
import { EmailComposer } from '@ionic-native/email-composer';



@Component({
  selector: 'page-job',
  templateUrl: 'job.html'
})

export class JobPage {
  public job:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public singleJob:JobsProvider, 
    public toastCtrl: ToastController,
    private eComposer: EmailComposer
    ) {
      this.job = this.navParams.get('jobsData');
  }

emailEmployer(employerEmail:string) {

  let emailOpts = {
  to: 'fitzm@gmail.com',
  cc: 'another@email.com',
  bcc: ['john@doe.com', 'jane@doe.com'],
  subject: 'Application for xyz job opening',
  body: 'Please attach a copy of your resume and cover letter',
  isHtml: true
};

this.eComposer.open(emailOpts);


}



  favorite(){
   
    let toast = this.toastCtrl.create({
    message: 'Added to Favorites',
    duration: 3000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
  }
}
