import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { MenuPage } from '../../pages/menu/menu';

/*
  Generated class for the Header component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'header-component',
  templateUrl: 'header.html'
})
export class HeaderComponent {
  @Input() title : string; 
  text: string;

  constructor(public modalCtrl: ModalController) {
    this.text = 'Hello World';
  }

   presentModal() {
    let modal = this.modalCtrl.create(MenuPage);
    modal.present();
  }


}
