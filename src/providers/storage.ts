 import { Injectable } from '@angular/core';

import { storage, initializeApp } from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database';

import { Upload } from '../models/upload';
import { FIREBASE_CONFIG } from '../app/app.firebase.config';

@Injectable()
export class FBStorageProvider {

    private basePath:string = '/resume';
  constructor( private afDatabase: AngularFireDatabase) {
   //  initializeApp(FIREBASE_CONFIG);
 }

 uploadResume(blob: any, filename: string, uid: string ) : any  {
        let storageRef = storage().ref();
        console.log('upload file', filename, uid);
        
        let uploadTask = storageRef.child(`${this.basePath}/${filename}`).put(blob);
        uploadTask.on(storage.TaskEvent.STATE_CHANGED,
        (snapshot: any) =>  {
            
        },
        (error) => {
            throw error;
        },
        () => {
            // this.getResumeUrl(uid).valueChanges().subscribe(res => {
            //     let currentResumeUrl = '';
            //     if(res && (res.length > 0)) {
            //         let user = res[0];
            //         console.log('user', user);
            //         if(user && (user.resumeUrl)) {
            //             currentResumeUrl = user.resumeUrl;
            //             console.log('currentResumeUrl', currentResumeUrl);
            //         }
            //     }
            // });

            console.log('6', uploadTask.snapshot.downloadURL);
            
            let resumeUrl = uploadTask.snapshot.downloadURL;
            this.updateUser(uid, resumeUrl);
        }
        );
    }

    deleteFile(upload: Upload) {
        let storageRef = storage().ref();
        storageRef.child(`${this.basePath}/${name}`).delete();
    }

    updateUser(uid: string, resumeUrl: string) {
        var resume = {
          resumeUrl: resumeUrl
        };
        console.log(uid, resume);
        this.afDatabase.list("users").update(uid, resume)
        .then(data => console.log('user updated', data))
        .catch(err => console.error(err.message));
      }
    
    // getResumeUrl(uid: string) {
    //     return this.afDatabase.list("users", res => res.orderByKey().equalTo(uid));

    // }

}
