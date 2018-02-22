import { Injectable } from '@angular/core';
import { SettingsProvider } from './settings';
import * as AWS from 'aws-sdk';
//require('aws-sdk/dist/aws-sdk');

@Injectable()
export class AWSStorageProvider {

    resumeBucket: string;
    profileBucket: string;
    groupBucket: string;
    chatBucket: string;
    region: string;
    access_id: string;
    secret: string;
    s3: any;

    constructor(
      private settings : SettingsProvider) {

    }

    uploadFile(fileName: string, fileType: string, type: string, body: any)  {
        let promise = new Promise((resolve, reject) => {
        this.settings.aws().valueChanges()
        .subscribe(data => {
          if(data && (data.length > 0)) {
            let result : any[] = data;
            
            this.access_id = result[0].AccessKeyID;
            this.secret = result[0].SecretAccessKey;
            this.resumeBucket = result[0].resumeBucket;
            this.profileBucket = result[0].profileBucket;
            this.groupBucket = result[0].groupBucket;
            this.chatBucket = result[0].chatBucket;
            this.region = result[0].region;
            
            this.configureAWS();
                  
            var s3 = new AWS.S3();
            
            var params = {
                Bucket: this.profileBucket,
                Key: fileName,
                Body: body,
                ACL: 'public-read',
                ContentType: fileType
            };

            if(type === 'resume') {
                params.Bucket = this.resumeBucket;
            }
            else if (type === 'group') {
                params.Bucket = this.groupBucket;
            }
            else if (type === 'chat') {
                params.Bucket = this.chatBucket;
            }

            
            s3.putObject(params, function (err, res) {
                if (err) {
                    
                    reject(err);
                } else {
                    let url = 'https://s3.amazonaws.com/' + params.Bucket + '/' + fileName;
                    resolve(url);
                }
            });              
            
          }
        });
    });
    return promise;
    }

    private configureAWS() {
        AWS.config.accessKeyId = this.access_id;
        AWS.config.secretAccessKey = this.secret;

    }


}
