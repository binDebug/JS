import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { JobsProvider } from '../../providers/jobs';
import { JobPage } from '../../pages/job/job';

import "rxjs/add/operator/map";


@Component({
  selector: 'jobs-feed',
  templateUrl: 'jobs.html'
})
export class JobsComponent {

  text: string;
  jobList:any[];
  args:any =  {featured:true};

  constructor(
   
    public jobsService: JobsProvider,
    public navCtrl: NavController
  ) {

    
    this.jobsService.loaderShow();

    this.jobsService.getJobs().valueChanges()
        .subscribe(data => {
          this.jobList = data;
          
        });
      
   
  }
  
  openJob(selectedJob: any){
 
 let dataObj =  {
   jobsData: selectedJob
 }

  this.navCtrl.push(JobPage,dataObj)
 
}

}
