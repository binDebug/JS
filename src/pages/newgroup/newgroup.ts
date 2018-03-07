import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
import { Group } from '../../models/group';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { user } from '../../models/user';
import { UsersProvider } from '../../providers/users';
import { GroupcontactsPage } from '../groupcontacts/groupcontacts';
import { FileChooser } from '@ionic-native/file-chooser';
import { AWSStorageProvider } from '../../providers/awsStorage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { HTMLInputEvent } from '../../models/html-input-event';

@IonicPage()
@Component({
  selector: 'page-newgroup',
  templateUrl: 'newgroup.html',
})
export class NewgroupPage implements OnInit {

  groupId: string = null;
  group = {  } as Group;
  userData: any;
  uid: string = null;
  isUploading: boolean = false;
  members: user[] = [];
  pictureUrl: string = null;
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  };

  constructor(public navCtrl: NavController, 
      private platform: Platform,
      public navParams: NavParams, 
      public groupservice: GroupsProvider, 
      public userService: UsersProvider,
      public toastCtrl: ToastController,
      public loadingCtrl: LoadingController,
      private fileChooser: FileChooser,
      private filePath: FilePath,
      private storage: AWSStorageProvider,
      private file: File,
      private camera: Camera
  ) {

        this.groupId = this.navParams.get('groupId');
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
    }

    if(this.groupId && (this.groupId != null)) {
      this.groupservice.getGroup(this.groupId).valueChanges()
      .subscribe(data => {
        if(data && (data.length > 0)) {
          this.group = data[0] as Group;
        }
      },
      err => this.showError(err.message));

      this.getMembers();
    }
  }

  getMembers() {
    
    this.members = [];

    this.groupservice.getGroupMembers(this.groupId).valueChanges()
    .subscribe(data => {
      
      if(data && (data.length > 0)) {
        data.forEach(element => {
        this.userService.getUser(element['uid']).valueChanges()
        .subscribe(data1 => {
          if(data1 && (data1.length > 0)) {
            let item = this.members.find(p => p['id'] === data1[0]['id']);
            if(item) {
              item.displayName = data1[0]['displayName'];
            }
            else {
              this.members.push(data1[0] as user);
            }
          }
        },
        err => this.showError(err.message));
      });
      }
      
    }
    , err => this.showError(err.message));
  }

  addMember() {
    let data = {
      groupId: this.groupId
    };
    this.navCtrl.push(GroupcontactsPage, data);
  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }

  saveGroup() {
    if(!this.groupId) {
      this.group.ownerId = this.uid;
      
      this.groupservice.addGroup(this.group)
      .then(data => {
        this.groupId = data.key;
        this.groupservice.updateGroupId(this.groupId)
        .then(data => {})
        .catch(err => this.showError(err.message));

        this.groupservice.addGroupMember(this.groupId, this.uid)
        .then(data => {})
        .catch(err => this.showError(err.message));
      }
      , err => this.showError(err.message));
     
    }
    else {
      this.groupservice.updateName(this.groupId, this.group.name)
      .then(data => {})
      .catch(err => this.showError(err.message));
    }
  }

  UpdatedDesc() {
    this.groupservice.updateDescription(this.groupId, this.group.description)
    .then(data => {})
    .catch(err => this.showError(err.message));

  }

  removeMember(item: user) {
    this.groupservice.removeGroupMember(this.groupId, item['id'])
    .then(data => {this.getMembers();})
    .catch(err => this.showError(err.message));
  }

  shoot() {

      
    let loading = this.loadingCtrl.create({
      content: 'Uploading picture. Please wait...'
    });

    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.isUploading = false;

      loading.present();


    var binary_string =  window.atob(imageData);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    let data = bytes.buffer;
    
      this.storage.uploadFile(this.groupId + '.jpeg', 'image/jpeg', 'group', data)
      .then(data => {
        if(data) {
          let url : string = <string>data;
        this.groupservice.updatePictureUrl(this.groupId, url)
        .then(data => {
          this.pictureUrl = url + "?random=" + Math.random().toString();
          this.isUploading = false;
          loading.dismiss();
          this.showError("Picture uploaded successfully");
        })
        .catch(err => {
          this.isUploading = false;
          loading.dismiss();
          this.showError(err.message);
        });
        } else {
          loading.dismiss();
        }
      })
      .catch(err => {
        this.isUploading = false;
        loading.dismiss();
        this.showError(err.message);
      });
     }, (err) => {
        this.isUploading = false;
        loading.dismiss();
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
          
          
          if(this.groupId) {
            continueUpload = true;
            uploadFileName = this.groupId + '.' + fileExt ;
          }
          
          if(continueUpload == true) {
            if((fileExt.toLowerCase() === 'jpg') || (fileExt.toLowerCase() === 'png') || (fileExt.toLowerCase() === 'gif')) {  
              this.file.readAsArrayBuffer(filePath,  fileName).then(
                (data) => {
                  var blob = new Blob([data], {
                    type: 'image/' + fileExt
                });

                this.storage.uploadFile( uploadFileName, 'image/' + fileExt, 'group', blob)
                .then(data => {
                    this.isUploading = false;
                  
                    if(data) {
                      let url : string = <string>data;
                    this.groupservice.updatePictureUrl(this.groupId, url)
                    .then(data => {
                      this.pictureUrl = url + "?random=" + Math.random().toString();
                      this.isUploading = false;
                      this.showError("Picture uploaded successfully");
                    })
                    .catch(err => {
                      this.isUploading = false;
                      this.showError(err.message);
                    });
                    }
                })
                .catch(err => {
                  this.isUploading = false;
                  this.showError(err.message);
                });
                })
              .catch(e => {
                this.isUploading = false;
                this.showError(e.message);
              });
            }
            else {
              this.isUploading = false;
              this.showError('Invalid profile picture');
            }
            }
          else {
            this.isUploading = false;
            this.showError("File cannot be uploaded at this time. Please relogin.");
          }
        });
      });
    })
    .catch(err => {
      this.isUploading = false;
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
    let uploadFileName = this.groupId + '.' + fileExt ;
    if((fileExt.toLowerCase() === 'jpg') || (fileExt.toLowerCase() === 'png') || (fileExt.toLowerCase() === 'gif')) {  
      this.storage.uploadFile( uploadFileName, 'image/' + fileExt, 'group', file)
      .then(data => {
          this.isUploading = false;
        
          if(data) {
            let url : string = <string>data;
            this.groupservice.updatePictureUrl(this.groupId, url)
            .then(data => {
              this.pictureUrl = url + "?random=" + Math.random().toString();
              this.isUploading = false;
              loading.dismiss();
              this.showError("Picture uploaded successfully");
          })
          .catch(err => {
            this.isUploading = false;
            loading.dismiss();
            this.showError(err.message);
          });
          } else {
            loading.dismiss();
          }
      })
      .catch(err => {
        this.isUploading = false;
        loading.dismiss();
        this.showError(err.message);
      });
    } else {
      this.isUploading = false;
      loading.dismiss();
      this.showError("File type is incorrect. Select an image file.");
    }
    
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

}
