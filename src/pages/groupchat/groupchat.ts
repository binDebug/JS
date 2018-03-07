import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, Content, Platform, LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { groupMessage } from '../../models/group-message';
import { GroupChatProvider } from '../../providers/groupChat';
import { UsersProvider } from '../../providers/users';
import { NotificationssProvider } from '../../providers/notifications';
import { GroupsProvider } from '../../providers/groups/groups';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AWSStorageProvider } from '../../providers/awsStorage';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { HTMLInputEvent } from '../../models/html-input-event';

@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
})

export class GroupchatPage implements OnInit{

  public groupName: string = '';
  public groupId: string = '';
  public userData: any;
  public uid: string = null;
  public newmessage: string = '';
  public allmessages = [];
  private members = [];
  public pictureUrl: string;
  public name: string;
  browser: any;
  showFileUpload = false;
  @ViewChild('content') content: Content;
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }

  constructor(public navCtrl: NavController, 
    private notificationsService: NotificationssProvider,
    private platform: Platform,
    public navParams: NavParams, 
    private loadingCtrl: LoadingController,
    private groupChatService: GroupChatProvider,
    private groupService: GroupsProvider,
    private userService: UsersProvider,
    private fileChooser: FileChooser,
    private storage: AWSStorageProvider,
    private file: File,
    private camera: Camera,
    private filePath: FilePath,
    private iab: InAppBrowser,
    private toastCtrl: ToastController) {
      this.groupName = this.navParams.get('groupName');
      this.groupId = this.navParams.get('groupId');
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;

      this.userService.getUser(this.uid).valueChanges()
      .subscribe(data => {
        let result : any[] = data;
        if(result && (result.length > 0)) {
          this.pictureUrl = result[0].pictureUrl;
          this.name = result[0].displayName;
          
      this.getMessages();

        }
      },
      err => this.showError(err.nessage));

      this.groupService.getGroupMembers(this.groupId)
      .valueChanges().subscribe(data => {
        if(data && (data.length > 0)) {
          this.members = data;
          let item = this.members.find(p => (p.uid === this.uid) && (p.groupid === this.groupId));

          if(item) {
            let index = this.members.indexOf(item);

            if(index >= 0) {
              this.members.splice(index, 1);
          }

        }
        }
      }, err => this.showError(err.message));
      
    }
  }


  getMessages() {
    
    this.groupChatService.getMessages(this.groupId).valueChanges() 
    .subscribe(data => {
      if(data && (data.length > 0)) {
        this.allmessages = [];
        for(var key in data[0]) {
          
          this.process(data[0][key], key);
        }
      }
    }, err=> this.showError(err.message));
  }
 
  process (element, i) {
    //let element = e[i];
    
    let obj = this.allmessages.find(p => p.timeStamp === i);
    if(obj) {
      return;
    }
    
    let item = {
      sender: element.sender,
      message: element.message,
      timeStamp: i,
      attachment:  element.attachment,
      senderName: '',
      senderUrl: ''
    };
    
    if(item.sender === this.uid) {
      item.senderName = this.name;
      item.senderUrl = this.pictureUrl;
        this.allmessages.push(item);
      
      this.sort();
      
    } else {
      this.userService.getUser(item.sender).valueChanges()
      .subscribe(data1 => {
        if(data1 && (data1.length > 0)) {
          item.senderName = data1[0]['displayName'],
          item.senderUrl = data1[0]['pictureUrl']
          let obj = this.allmessages.find(p => p.timeStamp === item.timeStamp);
            this.allmessages.push(item);
    
          this.sort();
        }
      }, err => this.showError(err.message));
    }
    
  }

  sort() {
    this.allmessages.sort(function(a,b) {
      return b.timeStamp - a.timeStamp;
    } ); 
  }

  addMessage(attachment: boolean) {
    if(this.newmessage.trim() === '')
      return;

    let message = {
      sender: this.uid,
      message: this.newmessage,
      timeStamp: Date.now(),
      groupId: this.groupId,
      attachment: attachment
    } as groupMessage;

    this.groupChatService.saveMessage(message)
    .then(data => {
      this.members.forEach((element, index) => {
        this.notificationsService.add(element.uid, Math.random().toString().replace('.', ''),
              'Group chat message', 'New message on the group: ' + this.groupName, 'group',
              null, null, this.groupId)
              .then(data => {})
              .catch(err => this.showError(err.message));
      });
      this.newmessage = '';
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

  shoot() {
    let loading = this.loadingCtrl.create({
      content: 'Uploading picture. Please wait...'
    });

    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      
    //  let base64Image = 'data:image/jpeg;base64,' + imageData;
  
    loading.present();

    var binary_string =  window.atob(imageData);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    let data = bytes.buffer;
    
      this.storage.uploadFile(this.groupId + '_' + Math.random().toString().replace('.', '') + '.jpeg', 
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
    let uploadFileName = this.uid + '_' + Math.random().toString().replace('.', '') + '.' + fileExt ;
    let appType = 'application/' + fileExt;
    if((fileExt.toLowerCase() === 'jpg') || (fileExt.toLowerCase() === 'png') || (fileExt.toLowerCase() === 'gif')) {  
      appType = 'image/'+ fileExt;
    }
    this.storage.uploadFile( uploadFileName, appType, 'chat', file)
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
      content: 'Uploading file. Please wait...'
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
            uploadFileName = this.groupId + '_' + Math.random().toString().replace('.', '') + '.' + fileExt ;
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

  download(item: groupMessage) {
    
    let url = item.message;
      let options = 'location=yes';

      this.iab.create(url, "_system", options);
    }
}
