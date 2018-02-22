import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { user } from '../models/user';

@Injectable()
export class UsersProvider {
  constructor(private afDatabase: AngularFireDatabase) {

  }

  // getallusers() {
    
  //   var promise = new Promise((resolve, reject) => {
      
  //     this.firedata.orderByChild('uid').once('value', (snapshot) => {
  //       let userdata = snapshot.val();
  //       let temparr: user[] = [];
  //       for (var key in userdata) {
  //         let tempuser: user = 
  //         {displayName : userdata[key].displayName, pictureUrl : userdata[key].pictureUrl, 
  //           email : userdata[key].email, uid : key}; 
  //         temparr.push(tempuser);
  //       }
  //       resolve(temparr);
  //     }).catch((err) => {
  //       reject(err);
  //     })
  //   })
  //   return promise;
  // }

   getAllUsers(){
     return this.afDatabase.list("users");
   }

  getUser(uid: string) {
    return this.afDatabase.list("users", res => res.orderByKey().equalTo(uid));
  }

  addUser(email: string, uid: string) {

    var user = {
      email: email,
      id: uid
    };


    this.afDatabase.list("users").set(uid, user)
      .then(function (res: any) {
      });


  }

  updateName (id: string, name: string) {
    return this.afDatabase.list("users").update(id, {displayName: name});
  }

  updateEmail (id: string, email: string) {
    return this.afDatabase.list("users").update(id, {email: email});
  }

  updateDeviceId (id: string, deviceId: string) {
    return this.afDatabase.list("users").update(id, {deviceid: deviceId});
  }

  removeDeviceId (id: string) {
    return this.afDatabase.list("users/"+id).remove('deviceid');
  }

  updatePhone(id: string, phone: string) {
    return this.afDatabase.list("users").update(id, { phone: phone });
  }

  updateLinkedIn(id: string, linkedIn: string) {
    return this.afDatabase.list("users").update(id, { linkedIn: linkedIn });
  }

  updateTwitter(id: string, twitter: string) {
    return this.afDatabase.list("users").update(id, { twitter: twitter });
  }

  updateFacebook(id: string, facebook: string) {
    return this.afDatabase.list("users").update(id, { facebook: facebook });
  }

  updateTitle(id: string, title: string) {
    return this.afDatabase.list("users").update(id, { title: title });
  }

  updateZip(id: string, zip: string) {
    return this.afDatabase.list("users").update(id, { zip: zip });
  }

  updateCountry(id: string, countryId: string) {
    return this.afDatabase.list("users").update(id, { country: countryId });
  }

  updateExperience(id: string, experienceId: string) {
    return this.afDatabase.list("users").update(id, { experience: experienceId });
  }

  updateEducation(id: string, educationId: string) {
    return this.afDatabase.list("users").update(id, { education: educationId });
  }

  updateIndustry(id: string, industryId: string) {
    return this.afDatabase.list("users").update(id, { industry: industryId });
  }

  updateSalary(id: string, salaryId: string) {
    return this.afDatabase.list("users").update(id, { salary: salaryId });
  }

  saveRelocate(id: string, relocate: boolean) {
    return this.afDatabase.list("users").update(id, { relocate: relocate });
  }

  saveResumeUrl(id: string, url: string) {
    return this.afDatabase.list("users").update(id, { resumeUrl: url });
  }

  savePicture(id: string, url: string) {
    return this.afDatabase.list("users").update(id, { pictureUrl: url });
  }

  saveResume(id: string, resume: boolean) {
    return this.afDatabase.list("users").update(id, { resume: resume });
  }

  saveJobNotificationSettings(id: string, allowJobNotification: boolean) {
    return this.afDatabase.list("users").update(id, { allowJobNotification: allowJobNotification });
  }

  saveReferences(id: string, references: string) {
    return this.afDatabase.list("users").update(id, { references: references });
  }
}


