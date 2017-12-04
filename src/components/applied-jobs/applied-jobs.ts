import { Component } from '@angular/core';
import { JobPage } from '../../pages/job/job';
import { ToastController, Events, NavController } from 'ionic-angular';
import { JobsProvider } from '../../providers/jobs';

@Component({
  selector: 'applied-jobs-feed',
  templateUrl: 'applied-jobs.html'
})
export class AppliedJobsComponent {

  allJobs: any[] = null;
  favJobs: any[] = [];
  appliedJobs: any[] = [];
  appliedJobRefs: any[] = null;
  retrievedAllJobs: boolean = false;
  retrievedFavJobs: boolean = false;
  retrievedAppliedJobs: boolean = false;
  uid: string;
  userData: any;

  constructor(private navCtrl: NavController,
    private toastCtrl: ToastController,
    private events: Events,
    private jobList: JobsProvider ) {
      this.events.subscribe('job:applied', () => this.getAppliedJobs());
      this.events.subscribe('job:unapplied', () => this.getAppliedJobs());
  }

  ngOnInit() {
    
    this.userData = window.localStorage.getItem('userData');
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      this.getAppliedJobs();
    }
  }

  private getAppliedJobs() {
    this.jobList.getFavoritedJobs(this.uid).valueChanges()
    .subscribe(data => {
      this.retrievedFavJobs = true;
      this.favJobs = data;
      this.processJobs();
    },
    err => this.showError(err.message));

  this.jobList.getJobs().valueChanges()
    .subscribe(data => {
      this.retrievedAllJobs = true;
      this.allJobs = data;
      this.processJobs();
    },
    err => this.showError(err.message));

  this.jobList.getAppliedJobs(this.uid).valueChanges()
    .subscribe(data => {
      this.retrievedAppliedJobs = true;
      this.appliedJobRefs = data;
      this.processJobs();
    },
      err => this.showError(err.message));
  }
  private processJobs() {
    this.appliedJobs = [];
    if(this.retrievedAllJobs && this.retrievedFavJobs && this.retrievedAppliedJobs) {
      if(this.appliedJobRefs) {
        for(let jobRef of this.appliedJobRefs) {
          let job = this.allJobs.find(p => p.id === jobRef.jobid);
          let favJob = this.favJobs.find(p => p.jobid === jobRef.jobid)
          if(job) {
            job.appliedOn = jobRef.date;
            
            if(favJob)
              job.favedOn = favJob.date;  
            this.appliedJobs.push(job);
          }
        }
      }
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
  openJob(selectedJob: any){
    
    let dataObj =  {
      jobsData: selectedJob
    }
   
     this.navCtrl.push(JobPage,dataObj)
    
   }

}
