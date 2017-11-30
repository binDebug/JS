import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
import { AuthProvider } from '../../providers/auth';
import { FileChooser } from '@ionic-native/file-chooser';
import { FBStorageProvider } from '../../providers/storage';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage implements OnInit {

  userData: any;
  uid: string = null;
  resumeUrl: string = '';
  currentUser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
      private toastCtrl: ToastController,
      private auth: AuthProvider,
      private fileChooser: FileChooser,
      private storage: FBStorageProvider,
      private filePath: FilePath,
      private file: File) {}

  ngOnInit() {
    this.currentUser = this.auth.getUser();
  }

ionViewDidLoad() {
  this.currentUser = this.auth.getUser();
}

  closeModal() {
    this.viewCtrl.dismiss()
  }

  logOut() {
    this.auth.signOut()
      .then(data => {
        window.localStorage.removeItem('userData');
        this.navCtrl.setRoot(LoginPage);
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

  chat() {
 
  }

  profile() {
    this.navCtrl.push(ProfilePage);
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
