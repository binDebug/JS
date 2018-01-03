import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class JobsProvider {
  public jobs: any;
  public loaderState:boolean;
  
  constructor(private afDatabase: AngularFireDatabase) {
    this.loaderState = true
  }

  loaderShow() {
  this.loaderState = true;
  }

  loaderHide() {
  this.loaderState = false;
  }

  getJobs() {
    return this.afDatabase.list("/jobs")
  }


  getJob(jobid: string) {
    return this.afDatabase.list("/jobs", res => res.orderByKey().equalTo(jobid));
  }

  isJobFavorited(uid: string, jobid: string) {
    let key: string = uid + '_' + jobid;
    return this.afDatabase.list("/favoritedjobs", res => res.orderByKey().equalTo(key));
  }

  favoriteJob(uid: string, jobid: string) {
    let item = {
      date : Date.now(),
      uid: uid,
      jobid: jobid
    };
    let key: string = uid + '_' + jobid;
    
    return this.afDatabase.list("/favoritedjobs")
      .set(key, item);
  }

  unfavoriteJob(key: string) {
    console.log('key', key);
    return this.afDatabase.list("/favoritedjobs").remove(key);
  }

  getFavoritedJobs(uid: string) {
    return this.afDatabase.list("/favoritedjobs", res => res.orderByChild("uid").equalTo(uid));
  }

  isJobApplied(uid: string, jobid: string) {
    let key: string = uid + '_' + jobid;
    return this.afDatabase.list("/appliedjobs", res => res.orderByKey().equalTo(key));
  }

  getAppliedJobs(uid: string) {
    return this.afDatabase.list("/appliedjobs", res => res.orderByChild("uid").equalTo(uid));
  }

  applyJob(uid: string, jobid: string) {
    let item = {
      date : Date.now(),
      uid: uid,
      jobid: jobid
    };
    let key: string = uid + '_' + jobid;
    
    return this.afDatabase.list("/appliedjobs")
      .set(key, item);
  }

  unApplyJob(key: string) {
    return this.afDatabase.list("/appliedjobs").remove(key);
  }

}
