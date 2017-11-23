import { OnInit, Component } from '@angular/core';
import {  NavController, NavParams, ToastController } from 'ionic-angular';
import { JobsProvider } from '../../providers/jobs';
import { JobPage } from '../job/job';

/**
 * Generated class for the FavoriteJobsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-favorite-jobs',
  templateUrl: 'favorite-jobs.html',
})
export class FavoriteJobsPage implements OnInit{

  allJobs: any[] = null;
  favJobs: any[] = [];
  favJobRefs: any[] = null;
  retrievedAllJobs: boolean = false;
  retrievedFavJobs: boolean = false;
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
    }
  }

  private processJobs() {
    if(this.retrievedAllJobs && this.retrievedFavJobs) {
      if(this.favJobRefs) {
        for(let jobRef of this.favJobRefs) {
          let job = this.allJobs.find(p => p.id === jobRef.jobid);
          if(job) {
            job.appliedOn = jobRef.date;
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

}
