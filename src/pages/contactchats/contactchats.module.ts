import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactchatsPage } from './contactchats';

@NgModule({
  declarations: [
    ContactchatsPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactchatsPage),
  ],
})
export class ContactchatsPageModule {}
