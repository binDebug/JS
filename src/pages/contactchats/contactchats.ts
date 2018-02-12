import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, LoadingController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { AppConstants } from '../../models/constants';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { UsersProvider } from '../../providers/users';
import { MediahandlerProvider } from '../../providers/mediahandler/mediahandler';
import { AWSStorageProvider } from '../../providers/awsStorage';
import firebase from 'firebase';

/**
 * Generated class for the ContactchatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  pictureURL;
  imgornot;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    public chatservice: ChatProvider,
    public events: Events, public zone: NgZone, public loadingControl: LoadingController,
    public imgstore: MediahandlerProvider,
    private fileChooser: FileChooser,
    private storage: AWSStorageProvider,
    private filePath: FilePath,
    private file: File) {
    this.contact = this.chatservice.contact;
    this.pictureURL = firebase.auth().currentUser.photoURL;

    this.scrollTo();
    this.events.subscribe(AppConstants.CONTACT_MESSAGES, () => {
      this.allmessages = [];
      this.imgornot = [];
      this.zone.run(() => {
        this.allmessages = this.chatservice.contactmessages;
        for (var key in this.allmessages) {
          //if (this.allmessages[key].message.substring(0, 4) == 'http')
          if (this.allmessages[key].message.includes('http'))
            this.imgornot.push(true);
          else
            this.imgornot.push(false);
        }
      })
    })
  }

  addMessage() {
    this.chatservice.addNewMessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }

  ionViewDidEnter() {
    this.chatservice.getContactMessages();
  }

  scrollTo() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  sendPicMsg() {
    let loader = this.loadingControl.create({
      content: 'Please wait'
    });
    loader.present();
    this.imgstore.picMessageStore().then((imgurl) => {
      loader.dismiss();
      this.chatservice.addNewMessage(imgurl).then(() => {
        this.scrollTo();
        this.newmessage = '';
      })
    }).catch((err) => {
      alert(err);
      loader.dismiss();
    })
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
    let loader = this.loadingControl.create({
      content: 'Please wait'
    });
    loader.present();
    this.fileChooser.open()
      .then(uri => {
        this.filePath.resolveNativePath(uri)
          .then(filePath => {
            this.file.resolveLocalFilesystemUrl(filePath)
              .then(resFile => {

                let filePath: string = this.getFilePath(resFile.nativeURL);
                let fileName: string = this.getFileName(resFile.nativeURL);
                let fileExt: string = this.getFileExt(resFile.nativeURL);

                let uploadFileName: string = '';
                uploadFileName = "Test" + '.' + fileExt;
                console.log(uploadFileName);

                if ((fileExt.toLowerCase() === 'jpg') || (fileExt.toLowerCase() === 'png') || (fileExt.toLowerCase() === 'gif')) {
                  this.file.readAsArrayBuffer(filePath, fileName).then(
                    (data) => {
                      var blob = new Blob([data], {
                        type: 'image/' + fileExt
                      });
                      console.log("1");
                      this.storage.uploadFile(uploadFileName, 'image/' + fileExt, blob)
                        .then(data => {
                          if (data) {
                            console.log("2");
                            loader.dismiss();
                            let url: string = <string>data;
                            this.chatservice.addNewMessage(url).then(() => {
                              console.log("3");
                              this.scrollTo();
                              this.newmessage = '';
                            })
                          }
                        })
                        .catch(err => {
                          console.log("4");
                          alert(err);
                          loader.dismiss();
                        });
                    })
                    .catch(e => {
                      console.log("5");
                      alert(e);
                      loader.dismiss();
                    });
                }
              });
          });
      })
      .catch(err => {
        console.log("6");
        alert(err);
        loader.dismiss();
      });
  }
}
