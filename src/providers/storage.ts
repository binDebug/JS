 import { Injectable } from '@angular/core';

import { storage, initializeApp } from 'firebase';
import { Upload } from '../models/upload';
import { FIREBASE_CONFIG } from '../app/app.firebase.config';

@Injectable()
export class FBStorageProvider {

    private basePath:string = '/resume';
  constructor( ) {
   //  initializeApp(FIREBASE_CONFIG);
 }

    uploadFile(blob: any, filename: string ) {
        let storageRef = storage().ref();
      
        let uploadTask = storageRef.child(`${this.basePath}/${filename}`).put(blob);
        uploadTask.on(storage.TaskEvent.STATE_CHANGED,
        (snapshot: any) =>  {
            
        },
        (error) => {
            console.error(error)
        },
        () => {
            console.log('6', uploadTask.snapshot.downloadURL);
            // upload success
            //upload.url = uploadTask.snapshot.downloadURL
            //upload.name = upload.file.name
            //this.saveFileData(upload)
        }
        );
    }

    // Writes the file details to the realtime db
    // private saveFileData(upload: Upload) {
    //     this.db.list(`${this.basePath}/`).push(upload);
    // }

    deleteFile(upload: Upload) {
        // this.deleteFileData(upload.$key)
        // .then( () => {
          this.deleteFileStorage(upload.name)
        // })
        // .catch(error => console.log(error))
    }

      // Deletes the file details from the realtime db
    //   private deleteFileData(key: string) {
    //     return this.db.list(`${this.basePath}/`).remove(key);
    //   }
    
    // Firebase files must have unique names in their respective storage dir
      // So the name serves as a unique key
    private deleteFileStorage(name:string) {
        let storageRef = storage().ref();
        storageRef.child(`${this.basePath}/${name}`).delete()
    }

    upload1(file: any) {
        let storageRef = storage().ref();
        return   storageRef.child(file.filename)
        //Saves the file to storage
                  .put(file.blob,{contentType:file.type}).then((savedFile) => {
        console.log('done', savedFile);
                  });

    }
}
