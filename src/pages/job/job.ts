import { Component, OnInit } from '@angular/core';
import { NavController, NavParams,ToastController, Events } from 'ionic-angular';
import { JobsProvider } from '../../providers/jobs';
import { EmailComposer } from '@ionic-native/email-composer';
import { UsersProvider } from '../../providers/users';
import { mailContent } from '../../models/mailContent';
import { MailProvider } from '../../providers/mail';

@Component({
  selector: 'page-job',
  templateUrl: 'job.html'
})

export class JobPage implements OnInit {
  public job:any;
  userData: any;
  uid: string = null;
  email: string = null;
  resumeUrl: string = '';
  isFavorite: boolean = false;
  isApplied: boolean = false;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public jobList:JobsProvider, 
    public toastCtrl: ToastController,
    private events: Events,
    private eComposer: EmailComposer,
    private usersList: UsersProvider,
    private mailer: MailProvider
    ) {
      this.job = this.navParams.get('jobsData');
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      this.email = JSON.parse(this.userData).email;
      this.usersList.getUser(this.uid).valueChanges()
        .subscribe(res => {
          
          if(res && (res.length > 0)) {
            let result : any[] = res;
            this.resumeUrl = result[0].resumeUrl;
          }
        });

        this.jobList.isJobFavorited(this.uid, this.job.id)
          .valueChanges().subscribe(res => {
              if(res && (res.length === 1))
                this.isFavorite = true;
          });

          this.jobList.isJobApplied(this.uid, this.job.id)
          .valueChanges().subscribe(res => {
              if(res && (res.length === 1))
                this.isApplied = true;
          });
    }
  }

  apply() {
    if(!this.isApplied) {
      if(!this.resumeUrl)
        this.showError('Upload resume to apply to this job.');
      else {
          this.jobList.applyJob(this.uid, this.job.id)
          .then(data => {
          this.emailEmployer();
          this.isApplied = true;
          this.events.publish('job:applied');
        })
        .catch(err => this.showError(err.message));
      }
    }
    else {
      this.jobList.unApplyJob(this.uid + '_' + this.job.id)
      .then(data => {
      this.isApplied = false;
      this.events.publish('job:unapplied');
    })
    .catch(err => this.showError(err.message));
    }
    
  }

  emailEmployer() {

    let emailOpts: mailContent = {
    to: this.job.contact,
    from: this.email,
    subject: 'Application for job opening: ' + this.job.jobTitle,
    html: 'Sir, I would like to apply for a job at your company. <br/>' 
          + ' Please view my <a href="' +  this.resumeUrl +'"> resume </a> here: ' 
          + this.resumeUrl,
    };
  
    this.mailer.SendMail(emailOpts)
    .then(data => {
      
      if(data && (data.data !== 'Sent')) {
        this.showError('Error sending mail to the recruiter');
      }
      else if (!data) {
        this.showError('Error sending mail to the recruiter');
      }
    })
    .catch(err => this.showError(err.message));
  
  }

  favorite(){
      if(this.isFavorite === false) {
        this.jobList.favoriteJob(this.uid, this.job.id)
        .then(data => { 
            this.isFavorite = true;
            this.events.publish('job:favorited');
         })
        .catch(err => this.showError(err.message));
      }
      else {
        this.jobList.unfavoriteJob(this.uid + '_' + this.job.id)
        .then(data => { 
            this.isFavorite = false;
            this.events.publish('job:unfavorited');
          })
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
