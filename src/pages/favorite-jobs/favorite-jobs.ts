import { OnInit, Component } from '@angular/core';
import {  NavController, NavParams, ToastController } from 'ionic-angular';
import { JobsProvider } from '../../providers/jobs';
import { JobPage } from '../job/job';
import {HeaderComponent} from '../../components/header/header';


@Component({
  selector: 'page-favorite-jobs',
  templateUrl: 'favorite-jobs.html',
})
export class FavoriteJobsPage implements OnInit{

  allJobs: any[] = null;
  favJobs: any[] = [];
  appliedJobs: any[] = [];
  favJobRefs: any[] = null;
  retrievedAllJobs: boolean = false;
  retrievedFavJobs: boolean = false;
  retrievedAppliedJobs: boolean = false;
  uid: string;
  userData: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private jobList: JobsProvider ) {
  }

  ngOnInit() {
    
    this.userData = window.localStorage.getItem('userData');
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      this.jobList.getFavoritedJobs(this.uid).valueChanges()
        .subscribe(data => {
          this.retrievedFavJobs = true;
          this.favJobRefs = data;
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
          this.appliedJobs = data;
          this.processJobs();
        },
          err => this.showError(err.message));
    }
  }

  private processJobs() {
    if(this.retrievedAllJobs && this.retrievedFavJobs && this.retrievedAppliedJobs) {
      if(this.favJobRefs) {
        for(let jobRef of this.favJobRefs) {
          let job = this.allJobs.find(p => p.id === jobRef.jobid);
          let appliedJob = this.appliedJobs.find(p => p.jobid === jobRef.jobid)
          if(job) {
            job.favedOn = jobRef.date;
            if(appliedJob)
              job.appliedOn = appliedJob.date;
            this.favJobs.push(job);
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
