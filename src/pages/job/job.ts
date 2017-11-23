import { Component, OnInit } from '@angular/core';
import { NavController, NavParams,ToastController } from 'ionic-angular';
import { JobsProvider } from '../../providers/jobs';
import { EmailComposer } from '@ionic-native/email-composer';
import { UsersProvider } from '../../providers/users';

@Component({
  selector: 'page-job',
  templateUrl: 'job.html'
})

export class JobPage implements OnInit {
  public job:any;
  userData: any;
  uid: string = null;
  resumeUrl: string = '';
  isFavorite: boolean = false;
  isApplied: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public jobList:JobsProvider, 
    public toastCtrl: ToastController,
    private eComposer: EmailComposer,
    private usersList: UsersProvider,
    ) {
      this.job = this.navParams.get('jobsData');
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      this.usersList.getUser(this.uid).valueChanges()
        .subscribe(res => {
          if(res && (res.length > 0))
            this.resumeUrl = JSON.parse(res[0]).resumeUrl;
        });

        this.jobList.isJobFavorited(this.uid, this.job.id)
          .valueChanges().subscribe(res => {
              if(res && (res.length === 1))
                this.isFavorite = true;
          });

          this.jobList.isJobApplied(this.uid, this.job.id)
          .valueChanges().subscribe(res => {
              if(res && (res.length === 1))
                this.isFavorite = true;
          });
    }
    

  }

  apply() {
    if(!this.isApplied) {
      this.jobList.applyJob(this.uid, this.job.id);
      this.isApplied = true;
    }
    else {
      this.jobList.unApplyJob(this.uid + '_' + this.job.id);
      this.isApplied = false;
    }
    //this.emailEmployer('');
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
      if(this.isFavorite === false) {
        this.jobList.favoriteJob(this.uid, this.job.id)
        .then(data => { this.isFavorite = true; })
        .catch(err => this.showError(err.message));
      }
      else {
        this.jobList.unfavoriteJob(this.uid + '_' + this.job.id)
        .then(data => { this.isFavorite = false;})
        .catch(err => this.showError(err.message));
      }
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
