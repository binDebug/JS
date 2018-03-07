import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, LoadingController, Platform } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { AppConstants } from '../../models/constants';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { UsersProvider } from '../../providers/users';
//import { MediahandlerProvider } from '../../providers/mediahandler/mediahandler';
import { AWSStorageProvider } from '../../providers/awsStorage';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { message } from '../../models/message';
import { NotificationssProvider } from '../../providers/notifications';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { HTMLInputEvent } from '../../models/html-input-event';

@IonicPage()
@Component({
  selector: 'page-contactchats',
  templateUrl: 'contactchats.html',
})
export class ContactchatsPage {
  @ViewChild('content') content: Content;
  contact: any;
  newmessage;
  allmessages = [];
  pictureUrl1: string;
  pictureUrl2: string;
  displayName1: string;
  displayName2: string;
  imgornot;
  browser: any;
  userData: any;
  showFileUpload = false;
  uid: string = null;
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private platform: Platform,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public chatservice: ChatProvider,
    public userService: UsersProvider,
    private notificationService: NotificationssProvider,
    public events: Events, 
    public zone: NgZone, 
    public loadingControl: LoadingController,
    private fileChooser: FileChooser,
    private storage: AWSStorageProvider,
    private file: File,
    private camera: Camera,
    private iab: InAppBrowser,
    private filePath: FilePath) {
      this.contact = this.navParams.get('contactData');
        
  }

  sort() {
    this.allmessages.sort(function(a,b) {
      return b.timeStamp - a.timeStamp;
    } ); 
  }

  addMessage(attachment: boolean) {
    let item: message = {
      id1: this.contact.id1,
      id2: this.contact.id2,
      timeStamp: Date.now(),
      message: this.newmessage,
      attachment: attachment
    };
    

    this.chatservice.saveMessage(item)
    .then(data => {
      let chatid = (item.id1 < item.id2) ? item.id1 + '_' + item.id2 : item.id2 + '_' + item.id1;
      
      let toid = item.id1 === this.uid ? item.id2 : item.id1
      let displayName = item.id1 === this.uid ? this.displayName1: this.displayName2;

        this.notificationService.add(toid, Math.random().toString().replace('.',''), 'Chat message',
              'New message from ' + displayName, 'chat', null, null, chatid
            )
            .catch(err => this.showError(err.message));
        this.newmessage = '';
        
    })
    .catch(err => this.showError(err.message));
    
  }

  ionViewDidEnter() {
    this.userData = window.localStorage.getItem('userData');
      if(this.userData) {
        this.uid = JSON.parse(this.userData).id;
      }

    this.userService.getUser(this.contact.id1)
    .valueChanges().subscribe(data => {
      if( data && (data.length > 0)) {
        this.pictureUrl1 = data[0]['pictureUrl'];
        this.displayName1 = data[0]['displayName'];
      }
    },
    err => this.showError(err.message));

    this.userService.getUser(this.contact.id2)
    .valueChanges().subscribe(data => {
      if( data && (data.length > 0)) {
        this.pictureUrl2 = data[0]['pictureUrl'];
        this.displayName2 = data[0]['displayName'];
      }
    },
    err => this.showError(err.message));
    this.getMessages();
  }

  getMessages() {
    
    this.chatservice.getMessages(this.contact.id1, this.contact.id2)
    .valueChanges().subscribe(data => {
      if(data && (data.length > 0)) {
        this.allmessages = [];    
        let messageIds = Object.keys( data[0]);
        messageIds.forEach(element => {
           let item = data[0][element];
           item.timeStamp = element;
           this.allmessages.push(item);
           this.sort();
           
        });
      }

    //  this.content.scrollToBottom();
    },
     err => this.showError(err.message))

  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }

  shoot() {

    let loading = this.loadingCtrl.create({
      content: 'Uploading picture. Please wait...'
    });

    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      
    loading.present();
    var binary_string =  window.atob(imageData);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    let data = bytes.buffer;
    
      this.storage.uploadFile(this.uid + '_' + Math.random().toString().replace('.', '') + '.jpeg', 
        'image/jpeg', 'chat', data)
      .then(data => {
        if(data) {
          let url : string = <string>data;
          this.newmessage = url;
          this.addMessage(true);
        }
        loading.dismiss();
      })
      .catch(err => {
        loading.dismiss();
        this.showError(err.message);
      });
     }, (err) => {
        loading.dismiss();
        this.showError(err.message);
     });
  }

  
  selectPicture(event: HTMLInputEvent) {
    let loading = this.loadingCtrl.create({
      content: 'Uploading picture. Please wait...'
    });

    loading.present();

    let file = event.target.files[0];
    let fileExt: string = this.getFileExt(file.name);
    let uploadFileName = this.uid + '.' + fileExt ;
    let appType = 'application/' + fileExt;
    if((fileExt.toLowerCase() === 'jpg') || (fileExt.toLowerCase() === 'png') || (fileExt.toLowerCase() === 'gif')) {  
      appType = 'image/'+ fileExt;
    }
    this.storage.uploadFile( uploadFileName, appType, 'profile', file)
    .then(data => {
      if(data) {
        let url : string = <string>data;
        this.newmessage = url;
        this.addMessage(true);
      }
      loading.dismiss();
    })
    .catch(err => {
      this.showFileUpload = false;
      loading.dismiss();
      this.showError(err.message);
    });
  }
  
  picture() {

    let loading = this.loadingCtrl.create({
      content: 'Uploading picture. Please wait...'
    });

    this.fileChooser.open()
    .then(uri =>  {
      loading.present();
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
            uploadFileName = this.uid + '_' + Math.random().toString().replace('.', '') + '.' + fileExt ;
          }
          
          if(continueUpload == true) {
              this.file.readAsArrayBuffer(filePath,  fileName).then(
                (data) => {
                  var blob = new Blob([data], {
                    type: 'application/' + fileExt
                });
                this.storage.uploadFile( uploadFileName, 'application/' + fileExt, 'chat', blob)
                .then(data => {
                    
                    if(data) {
                      let url : string = <string>data;
                      this.newmessage = url;
                      this.addMessage(true);
                    }
                    loading.dismiss();
                })
                .catch(err => {
                  loading.dismiss();
                  this.showError(err.message);
                });
                })
              .catch(e => {
                loading.dismiss();
                this.showError(e.message);
              });
           
            }
          else {
            loading.dismiss();
            this.showError("File cannot be uploaded at this time. Please relogin.");
          }
        })
        .catch(err => {
          loading.dismiss();
          this.showError(err.message);
        });
      })
      .catch(err => {
        loading.dismiss();
        this.showError(err.message);
      });
    })
    .catch(err => {
      loading.dismiss();
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
    while(fileName.indexOf('%20') >= 0) {
      fileName = fileName.replace('%20', ' ');
    }
    return fileName;
  }

  getFileExt(path: string){
    let fileName: string;

    let index = path.lastIndexOf('.');
    fileName = path.substring(index+1);

    return fileName;
  }

  download(item: message) {
    
    let url = item.message;
      let options = 'location=yes';

      this.iab.create(url, "_system", options);
  }
}
