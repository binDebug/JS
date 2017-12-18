import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
import { AuthProvider } from '../../providers/auth';

import { ChangePasswordPage } from '../change-password/change-password';
import { NotificationsSettingsPage } from '../notifications-settings/notifications-settings';
import { ReferencesPage } from '../references/references';
import { Events } from 'ionic-angular';
import { ResumeComponent } from '../../components/resume/resume';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { UsersProvider } from '../../providers/users';
import { AWSStorageProvider } from '../../providers/awsStorage';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})


export class MenuPage implements OnInit {

  userData: any;
  uid: string = null;
  resumeUrl: string = '';
  currentUser: any;
  pictureUrl: string = null;
  isUploading: boolean = false;
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
      private toastCtrl: ToastController,
      private auth: AuthProvider,
      private events: Events,
      private modalCtrl: ModalController,
      private fileChooser: FileChooser,
      private storage: AWSStorageProvider,
      private filePath: FilePath,
      private file: File,
      private users: UsersProvider,
      private camera: Camera
      ) {}

  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.userData = window.localStorage.getItem('userData');
    
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
      this.users.getUser(this.uid).valueChanges()
      .subscribe(data => {
        let result : any[] = data;
        if(result && (result.length > 0)) {
          this.pictureUrl = result[0].pictureUrl;
        }
      },
      err => this.showError(err.nessage));
      
    }
  }

ionViewDidLoad() {
  this.currentUser = this.auth.getUser();

}

  closeModal() {
    this.viewCtrl.dismiss();
  }

  changePassword() {
    this.navCtrl.push(ChangePasswordPage);
  }

  logOut() {
    this.auth.signOut()
      .then(data => {
        
        window.localStorage.removeItem('userData');
        this.events.publish('logout');
        this.navCtrl.setRoot(LoginPage);
      })
      .catch(err => this.showError(err.message));
    
  }

  notifications() {
    this.navCtrl.push(NotificationsSettingsPage);
  }

  references() {
    this.navCtrl.push(ReferencesPage);
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
    let modal = this.modalCtrl.create(ResumeComponent);
    modal.present();
  }

  shoot() {

    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.isUploading = false;
      let base64Image = 'data:image/jpeg;base64,' + imageData;
  //    console.log('imageData', imageData);

  var binary_string =  window.atob(imageData);
  var len = binary_string.length;
  var bytes = new Uint8Array( len );
  for (var i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
  }
  let data = bytes.buffer;
  
      this.storage.uploadFile(this.uid + '.jpeg', 'image/jpeg', data)
      .then(data => {
        if(data) {
          let url : string = <string>data;
        this.users.savePicture(this.uid, url)
        .then(data => {
          this.pictureUrl = url + "?random=" + Math.random().toString();
          console.log('this.pictureUrl', this.pictureUrl);
          this.showError("Picture uploaded successfully");
        })
        .catch(err => {
          this.showError(err.message);
        });
        }
      })
      .catch(err => {
        this.showError(err.message);
      });
     }, (err) => {
        this.showError(err.message);
     });
  }

  picture() {
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
            uploadFileName = this.uid + '.' + fileExt ;
          }
          
          if(continueUpload == true) {
            if((fileExt.toLowerCase() === 'jpg') || (fileExt.toLowerCase() === 'png') || (fileExt.toLowerCase() === 'gif')) {  
              this.file.readAsArrayBuffer(filePath,  fileName).then(
                (data) => {
                  var blob = new Blob([data], {
                    type: 'image/' + fileExt
                });

                this.storage.uploadFile( uploadFileName, 'image/' + fileExt, blob)
                .then(data => {
                    this.isUploading = false;
                  
                    if(data) {
                      let url : string = <string>data;
                    this.users.savePicture(this.uid, url)
                    .then(data => {
                      this.pictureUrl = url + "?random=" + Math.random().toString();
                      console.log('this.pictureUrl', this.pictureUrl);
                      this.showError("Picture uploaded successfully");
                    })
                    .catch(err => {
                      this.showError(err.message);
                    });
                    }
                })
                .catch(err => {
                  this.showError(err.message);
                });
                })
              .catch(e => {
                this.showError(e.message);
              });
            }
            else {
              this.showError('Invalid profile picture');
            }
            }
          else {
            this.showError("File cannot be uploaded at this time. Please relogin.");
          }
        });
        });
        })
      .catch(err => {
        this.showError(err.message);
      });
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

}
