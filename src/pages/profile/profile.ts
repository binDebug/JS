import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

import { FBStorageProvider } from '../../providers/storage';
import { Upload } from '../../models/upload';
import { File, FileReader } from '@ionic-native/file';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage {
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private fileChooser: FileChooser,
    private toastCtrl: ToastController,
    private storage: FBStorageProvider,
    private filePath: FilePath,
    private file: File
    ) {
    }

    uploadResume() {
      this.fileChooser.open()
      .then(uri =>  {
        this.filePath.resolveNativePath(uri)
        .then(filePath => {
          this.file.resolveLocalFilesystemUrl(filePath)
          .then(resFile => {
            
     
            let filePath: string = this.getFilePath(resFile.nativeURL);
            let fileName: string = this.getFileName(resFile.nativeURL);
            let fileExt: string = this.getFileExt(resFile.nativeURL);
     
          if(fileExt.toLowerCase() == 'pdf') {  
            this.file.readAsArrayBuffer(filePath, fileName).then(
              (data) => {
                var blob = new Blob([data], {
                  type: 'application/pdf'
              });
                this.storage.uploadFile(blob, 'Grade3.pdf');
              })
            .catch(e => this.showError(e));
          }
          else {
            this.showError('Invalid resume file');
          }
          });
          });
          })
        .catch(err => this.showError(err));
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