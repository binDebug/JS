import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { FileChooser } from '@ionic-native/file-chooser';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { UsersProvider } from '../../providers/users';
import { AWSStorageProvider } from '../../providers/awsStorage';

@Component({
  selector: 'resume',
  templateUrl: 'resume.html'
})
export class ResumeComponent implements OnInit {
  
  userData: any;
  uid: string = null;
  resumeUrl: string = null;

  constructor(private viewCtrl: ViewController,
  private toastCtrl: ToastController,
  private fileChooser: FileChooser,
  private storage: AWSStorageProvider,
  private filePath: FilePath,
  private file: File,
  private users: UsersProvider,
  private iab: InAppBrowser) {

  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      this.users.getUser(this.uid).valueChanges()
      .subscribe(res => {
        if(res && (res.length > 0)) {
          let result : any[] = res;
          this.resumeUrl = result[0].resumeUrl;
        } },
        err => this.showError(err.message));
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
          
          if(this.uid) {
            continueUpload = true;
            uploadFileName = this.uid + '.pdf' ;
          }
          
          if(continueUpload == true) {
            if(fileExt.toLowerCase() === 'pdf') {  
              this.file.readAsArrayBuffer(filePath,  fileName).then(
                (data) => {
                  var blob = new Blob([data], {
                    type: 'application/pdf'
                });

                this.storage.uploadFile( uploadFileName, 'application/pdf', blob)
                .then(data => {
                    
                    if(data) {
                      let url : string = <string>data;
                    this.users.saveResumeUrl(this.uid, url)
                    .then(data => {
                      this.resumeUrl = url;
                      this.showError("Resume uploaded successfully");
                    })
                    .catch(err => this.showError(err.message));
                    }
                })
                .catch(err => this.showError(err.message));
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
      
      getFilePath(path: string){
        let fileName: string;
  
        let index = path.lastIndexOf('/');
        fileName = path.substring(0, index+1);
  
        return fileName;
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

      openResume() {

        let options = 'location=yes';
        const browser = this.iab.create(this.resumeUrl, "_system", options);
       
      }
  
  closeModal() {
    this.viewCtrl.dismiss();
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
