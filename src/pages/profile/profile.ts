import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users';
import { AuthProvider } from '../../providers/auth';
import { UtilProvider } from '../../providers/utils';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage implements OnInit {
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private users: UsersProvider,
    private auth: AuthProvider,
    private utils: UtilProvider
    ) {
    }
    userData: any;
    uid: string = null;
    resumeUrl: string = '';

    currentUser: any;
    
    name: string = '';
    email: string = '';
    phone: string = '';
    zip: string = '';
    title: string = '';
    countryId: string = '';
    experienceId: string = '';
    educationId: string = '';
    salaryId: string = '';
    industryId: string = '';
    relocate: boolean = false;
    resume: boolean = false;
    twitterUrl: string = '';
    linkedInUrl: string = '';
    facebookUrl: string = '';
    
    countryList: any[] = [];
    experienceList: any[] = [];
    educationList: any[] = [];
    industryList: any[] = [];
    salaryList: any[] = [];

    ngOnInit() {
      this.userData = window.localStorage.getItem('userData');
      
      if(this.userData) {
        this.uid = JSON.parse(this.userData).id;
        this.users.getUser(this.uid).valueChanges()
          .subscribe(res => {
            if(res && (res.length > 0)) {
              let result : any[] = res;
              this.resumeUrl = result[0].resumeUrl;
              this.phone = result[0].phone;
              this.title = result[0].title;
              this.countryId = result[0].country;
              this.experienceId = result[0].experience;
              this.educationId = result[0].education;
              this.industryId = result[0].industry;
              this.salaryId = result[0].salary;
              this.relocate = result[0].relocate;
              this.resume = result[0].resume;
              this.linkedInUrl = result[0].linkedInUrl;
              this.twitterUrl = result[0].twitterUrl;
              this.facebookUrl = result[0].facebookUrl;
              this.zip = result[0].zip;
              this.name = result[0].displayName;
            }
          },
          err => this.showError(err.message));
          this.currentUser = this.auth.getUser();
      
          if(this.currentUser.email)
            this.email = this.currentUser.email.trim();
          
          this.utils.countriesList().valueChanges()
          .subscribe(data => this.countryList = data,
              err => this.showError(err.message));

          this.utils.experienceList().valueChanges()
          .subscribe(data => this.experienceList = data,
              err => this.showError(err.message));

          this.utils.educationList().valueChanges()
          .subscribe(data => this.educationList = data,
              err => this.showError(err.message));
      
          this.utils.industryList().valueChanges()
          .subscribe(data => this.industryList = data,
              err => this.showError(err.message));

          this.utils.salaryList().valueChanges()
          .subscribe(data => this.salaryList = data,
              err => this.showError(err.message));              
       }
    }

    saveName() {
      if(!this.name)
        this.name = '';

      this.users.updateName(this.uid, this.name.trim())
      .catch(err => this.showError(err.message)) ;
     
    }

    saveEmail() {
      if(!this.email)
        this.email = '';

      this.auth.updateEmail(this.email.trim())
      .then(data => {
        this.currentUser = this.auth.getUser();
        this.email = this.currentUser.email.trim();
        this.users.updateEmail(this.uid, this.email)
        .catch(err => this.showError(err.message));
      })
      .catch(err => {
        this.showError(err.message);
        this.email = this.currentUser.email.trim();
      }) ;
      
      
    }

    savePhone() {
      if(!this.phone)
      this.phone = '';

      this.users.updatePhone(this.uid, this.phone.trim())
      .catch(err => this.showError(err.message)) ;
      
    }

    
    saveLinkedIn() {
      if(!this.linkedInUrl)
      this.linkedInUrl = '';

      this.users.updateLinkedIn(this.uid, this.linkedInUrl.trim())
      .catch(err => this.showError(err.message)) ;
      
    }

    
    saveTwitter() {
      if(!this.twitterUrl)
      this.twitterUrl = '';

      this.users.updateTwitter(this.uid, this.twitterUrl.trim())
      .catch(err => this.showError(err.message)) ;
      
    }

    
    saveFacebook() {
      if(!this.facebookUrl)
      this.facebookUrl = '';

      this.users.updateFacebook(this.uid, this.facebookUrl.trim())
      .catch(err => this.showError(err.message)) ;
      
    }

    saveRelocate() {
      this.users.saveRelocate(this.uid, this.relocate)
      .catch(err => this.showError(err.message)) ;
      
    }

    saveResume() {
      this.users.saveResume(this.uid, this.resume)
      .catch(err => this.showError(err.message)) ;
      
    }

    saveTitle() {
      if(!this.title)
        this.title = '';

      this.users.updateTitle(this.uid, this.title.trim())
      .catch(err => this.showError(err.message)) ;
      
    }

    saveZip() {
      if(!this.zip)
        this.zip = '';

      this.users.updateZip(this.uid, this.zip.trim())
      .catch(err => this.showError(err.message)) ;
      
    }

    closeModal() {
      this.viewCtrl.dismiss();
    }
  
  
    showError(message: string) {
      let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
          });
      toast.present();
    }

    selectCountry() {
      this.users.updateCountry(this.uid, this.countryId)
      .catch(err => this.showError(err.message));
    }

    selectExperience() {
      this.users.updateExperience(this.uid, this.experienceId)
      .catch(err => this.showError(err.message));
    }

    selectEducation() {
      this.users.updateEducation(this.uid, this.educationId)
      .catch(err => this.showError(err.message));
    }

    selectIndustry() {
      this.users.updateIndustry(this.uid, this.industryId)
      .catch(err => this.showError(err.message));
    }

    selectSalary() {
      this.users.updateSalary(this.uid, this.salaryId)
      .catch(err => this.showError(err.message));
    }
}    