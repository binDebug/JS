import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

import { FBStorageProvider } from '../../providers/storage';
import { UsersProvider } from '../../providers/users';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage implements OnInit {
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private fileChooser: FileChooser,
    private toastCtrl: ToastController,
    private storage: FBStorageProvider,
    private users: UsersProvider,
    private filePath: FilePath,
    private file: File
    ) {
    }
    userData: any;
    uid: string = null;
    resumeUrl: string = '';

    ngOnInit() {
      this.userData = window.localStorage.getItem('userData');
      console.log('this.userData', this.userData);
      if(this.userData) {
        this.uid = JSON.parse(this.userData).id;
        console.log('uid', this.uid);
        this.users.getUser(this.uid).valueChanges()
          .subscribe(res => {
            console.log('res', res);
            if(res && (res.length > 0))
              this.resumeUrl = JSON.parse(res[0]).resumeUrl;
              
          });
      }
    }

    uploadResume() {
      
      
      this.fileChooser.open()
      .then(uri =>  {
        this.filePath.resolveNativePath(uri)
        .then(filePath => {
          this.file.resolveLocalFilesystemUrl(filePath)
          .then(resFile => {
            
            let continueUpload: boolean = false;

            let filePath: string = this.getFilePath(resFile.nativeURL);
            let fileName: string = this.getFileName(resFile.nativeURL);
            let fileExt: string = this.getFileExt(resFile.nativeURL);
     
            let uploadFileName: string = '';
            console.log('userData', this.userData);
          
            if(this.uid) {
              continueUpload = true;
              uploadFileName = this.uid + '.pdf' ;
            }
            
            if(continueUpload == true) {
              if(fileExt.toLowerCase() == 'pdf') {  
                this.file.readAsArrayBuffer(filePath,  fileName).then(
                  (data) => {
                    var blob = new Blob([data], {
                      type: 'application/pdf'
                  });

                  this.storage.uploadFile(blob, uploadFileName, this.uid);
                  })
                .catch(e => this.showError(e.message));
              }
              else {
                this.showError('Invalid resume file');
              }
            }
            else {
              this.showError("File cannot be uploaded at this time. Please relogin.");
            }
          });
          });
          })
        .catch(err => this.showError(err.message));
        }

    showError(message: string) {
      let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
          });
      toast.present();
    }

    getFilePath(path: string){
      let fileName: string;

      let index = path.lastIndexOf('/');
      fileName = path.substring(0, index+1);

      return fileName
    }

    getFileName(path: string){
      let fileName: string;

      let index = path.lastIndexOf('/');
      fileName = path.substring(index+1);

      return fileName
    }
  
    getFileExt(path: string){
      let fileName: string;

      let index = path.lastIndexOf('.');
      fileName = path.substring(index+1);

      return fileName
    }

}    