import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, LoadingController } from 'ionic-angular';
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
  userData: any;
  uid: string = null;
 


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public chatservice: ChatProvider,
    public userService: UsersProvider,
    private notificationService: NotificationssProvider,
    public events: Events, 
    public zone: NgZone, 
    public loadingControl: LoadingController,
  //  public imgstore: MediahandlerProvider,
    private fileChooser: FileChooser,
    private storage: AWSStorageProvider,
    private filePath: FilePath,
    private file: File) {
      this.contact = this.navParams.get('contactData');
        
    
    // this.events.subscribe(AppConstants.CONTACT_MESSAGES, () => {
    //   this.allmessages = [];
    //   this.imgornot = [];
    //   this.zone.run(() => {
    //     this.allmessages = this.chatservice.contactmessages;
    //     for (var key in this.allmessages) {
    //       //if (this.allmessages[key].message.substring(0, 4) == 'http')
    //       if (this.allmessages[key].message.includes('http'))
    //         this.imgornot.push(true);
    //       else
    //         this.imgornot.push(false);
    //     }
    //   })
    // })
  }

  sort() {
    this.allmessages.sort(function(a,b) {
      return b.timeStamp - a.timeStamp;
    } ); 
  }

  addMessage() {
    let item: message = {
      id1: this.contact.id1,
      id2: this.contact.id2,
      timeStamp: Date.now(),
      message: this.newmessage,
      attachment: false
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


  sendPicMsg() {
    // let loader = this.loadingControl.create({
    //   content: 'Please wait'
    // });
    // loader.present();
    // this.imgstore.picMessageStore().then((imgurl) => {
    //   loader.dismiss();
    //   this.chatservice.addNewMessage(imgurl).then(() => {
    //     this.scrollTo();
    //     this.newmessage = '';
    //   })
    // }).catch((err) => {
    //   alert(err);
    //   loader.dismiss();
    // })
  }

  getFilePath(path: string) {
    let fileName: string;

    let index = path.lastIndexOf('/');
    fileName = path.substring(0, index + 1);

    return fileName;
  }

  getFileName(path: string) {
    let fileName: string;

    let index = path.lastIndexOf('/');
    fileName = path.substring(index + 1);

    return fileName
  }

  getFileExt(path: string) {
    let fileName: string;

    let index = path.lastIndexOf('.');
    fileName = path.substring(index + 1);

    return fileName
  }

  sendPictureMessage() {
    // let loader = this.loadingControl.create({
    //   content: 'Please wait'
    // });
    // loader.present();
    // this.fileChooser.open()
    //   .then(uri => {
    //     this.filePath.resolveNativePath(uri)
    //       .then(filePath => {
    //         this.file.resolveLocalFilesystemUrl(filePath)
    //           .then(resFile => {

    //             let filePath: string = this.getFilePath(resFile.nativeURL);
    //             let fileName: string = this.getFileName(resFile.nativeURL);
    //             let fileExt: string = this.getFileExt(resFile.nativeURL);

    //             let uploadFileName: string = '';
    //             uploadFileName = "Test" + '.' + fileExt;
    //             console.log(uploadFileName);

    //             if ((fileExt.toLowerCase() === 'jpg') || (fileExt.toLowerCase() === 'png') || (fileExt.toLowerCase() === 'gif')) {
    //               this.file.readAsArrayBuffer(filePath, fileName).then(
    //                 (data) => {
    //                   var blob = new Blob([data], {
    //                     type: 'image/' + fileExt
    //                   });
    //                   console.log("1");
    //                   this.storage.uploadFile(uploadFileName, 'image/' + fileExt, blob)
    //                     .then(data => {
    //                       if (data) {
    //                         console.log("2");
    //                         loader.dismiss();
    //                         let url: string = <string>data;
    //                         this.chatservice.addNewMessage(url).then(() => {
    //                           console.log("3");
    //                           this.scrollTo();
    //                           this.newmessage = '';
    //                         })
    //                       }
    //                     })
    //                     .catch(err => {
    //                       console.log("4");
    //                       alert(err);
    //                       loader.dismiss();
    //                     });
    //                 })
    //                 .catch(e => {
    //                   console.log("5");
    //                   alert(e);
    //                   loader.dismiss();
    //                 });
    //             }
    //           });
    //       });
    //   })
    //   .catch(err => {
    //     console.log("6");
    //     alert(err);
    //     loader.dismiss();
    //   });
  }
}
