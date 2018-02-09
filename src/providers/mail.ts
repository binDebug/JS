import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import {mailContent} from '../models/mailContent';

@Injectable()
export class MailProvider {

    constructor(private http: HTTP) { }

    SendMail(content: mailContent){
        let result: boolean = false;

        let  headers = {headers: {'Content-Type': 'application/json'}};
        return this.http.post('http://ec2-34-205-146-242.compute-1.amazonaws.com:3000/api/mail/', content,
        JSON.stringify(headers));
    }
}