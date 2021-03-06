import { OnInit, Component } from '@angular/core';
import {  NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { EventsProvider } from '../../providers/events';
import { event } from '../../models/event';
import { PayPal, PayPalPayment, PayPalConfiguration} from '@ionic-native/paypal';

@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage implements OnInit {
  event: event;
  userData: any;
  uid: string = null;
  isFavorite: boolean = false;
  isRegistered: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public eventList:EventsProvider, 
              public toastCtrl: ToastController,
              private events:Events,
              private payPal: PayPal) {
    this.event = this.navParams.get('eventData');
    
    if(this.event && (!this.event.attendance)) {
      this.event.attendance = 0;
    }
  }

  ngOnInit() {
    this.userData = window.localStorage.getItem('userData');
    if(this.userData) {
      this.uid = JSON.parse(this.userData).id;
   
      this.eventList.isEventFavorited(this.uid, this.event.id)
      .valueChanges().subscribe(res => {
          if(res && (res.length === 1))
            this.isFavorite = true;
      });

      this.eventList.isEventApplied(this.uid, this.event.id)
      .valueChanges().subscribe(res => {
          if(res && (res.length === 1))
            this.isRegistered = true;
            
      });
    }
  }

  register() {
    if(!this.isRegistered) {
      if(this.event.price > 0) {
      this.payPal.init({
        PayPalEnvironmentSandbox: 'AQI7H5SuJV8ydsaIMsrkRHAsTkzbTZu1dbiurDpLVJC0twun0Ky6aj7Jmmc4eBu8-YXSnL6olRpdIwPH',
        PayPalEnvironmentProduction: ''
      }).then((data) => {
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
          // Only needed if you get an "Internal Service Error" after PayPal login!
          //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        })).then((data1) => {
          let payment = new PayPalPayment(this.event.price.toString(), 'USD', 'Description', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then((data4) => {
            this.eventList.applyEvent(this.uid, this.event.id)
            .then((data3) => {
              this.showError("You have successfully registered for the event.");
            })
            .catch(err => this.showError(err.message));
            this.isRegistered = true;
            
            // Successfully paid
      
            // Example sandbox response
            //
            // {
            //   "client": {
            //     "environment": "sandbox",
            //     "product_name": "PayPal iOS SDK",
            //     "paypal_sdk_version": "2.16.0",
            //     "platform": "iOS"
            //   },
            //   "response_type": "payment",
            //   "response": {
            //     "id": "PAY-1AB23456CD789012EF34GHIJ",
            //     "state": "approved",
            //     "create_time": "2016-10-03T13:33:33Z",
            //     "intent": "sale"
            //   }
            // }
          }, (err) => {
            this.showError("Payment unsuccessful. Try again");
            // Error or render dialog closed without being successful
          });
        }, (err) => {
          this.showError("Payment unsuccessful. Try again");
          // Error in configuration
        });
      }, (err) => {
        this.showError("Payment unsuccessful. Try again");
        // Error in initialization, maybe PayPal isn't supported or something else
      });
    }
    else {
      this.eventList.applyEvent(this.uid, this.event.id)
      .then((data) => {
        this.showError("You have successfully registered for the event.");
      })
      .catch(err => {
        this.showError(err.message);
      });
      this.isRegistered = true;
    }
    }
  }

  favorite() {
    if(this.isFavorite === false) {
      this.eventList.favoriteEvent(this.uid, this.event.id)
      .then(data => { 
        this.isFavorite = true;
        this.events.publish('event:favoriteEvent');
       })
      .catch(err => this.showError(err.message));
    }
    else {
      this.eventList.unfavoriteEvent(this.uid + '_' + this.event.id)
      .then(data => { 
        this.isFavorite = false;
        this.events.publish('event:unfavoriteEvent');
      })
      .catch(err => this.showError(err.message));
    }
  }

  showError(message: string) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
    toast.present();
  }

}
