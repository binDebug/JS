import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { FavoritesPage } from '../pages/favorites/favorites';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { MenuPage} from '../pages/menu/menu';
import { EventsPage } from '../pages/events/events';
import { EventPage } from '../pages/event/event';
import { JobPage } from '../pages/job/job';
import { ProfilePage } from '../pages/profile/profile';
import { AppliedPage } from '../pages/applied/applied';
import { FavoriteJobs } from '../components/favorite-jobs/favorite-jobs';
import { FavoriteEvents } from '../components/favorite-events/favorite-events';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {FIREBASE_CONFIG} from './app.firebase.config';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule, AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabaseModule, AngularFireDatabase} from 'angularfire2/database';


import {HeaderComponent } from '../components/header/header';
import {EventsComponent} from '../components/events/events';
import {JobsComponent } from '../components/jobs/jobs';
import {LoaderComponent} from '../components/loader/loader';
import {AppliedJobsComponent} from '../components/applied-jobs/applied-jobs';

import {UsersProvider} from '../providers/users';
import {InviteesProvider} from '../providers/invitees';
import {JobsProvider} from '../providers/jobs';
import {EventsProvider} from '../providers/events';
import {AuthProvider} from '../providers/auth';
import {FBStorageProvider} from '../providers/storage';
import {UtilProvider} from '../providers/utils';

import { FeaturedPipe} from '../pipes/featured';

import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';

import { PayPal } from '@ionic-native/paypal';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    FavoritesPage,
    HomePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    EventsPage,
    EventPage,
    MenuPage,
    JobPage,
    ProfilePage,
    AppliedPage,
    FavoriteJobs,
    FavoriteEvents,
    HeaderComponent,
    EventsComponent,
    JobsComponent,
    LoaderComponent,
    AppliedJobsComponent,
    FeaturedPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    FavoritesPage,
    HomePage,
    TabsPage,
    MenuPage,
    LoginPage,
    RegisterPage,
    EventsPage,
    EventPage,
    ProfilePage, 
    JobPage,
    AppliedPage
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsersProvider,
    InviteesProvider,
    EventsProvider,
    JobsProvider,
    AuthProvider,
    FBStorageProvider,
    UtilProvider,
    AngularFireAuth,
    AngularFireDatabase,
    FileChooser,
    FilePath,
    File,
    EmailComposer,
    PayPal
  ]
})
export class AppModule {}
