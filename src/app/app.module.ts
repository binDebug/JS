import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { FavoritesPage } from '../pages/favorites/favorites';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { LandingPage } from '../pages/landing/landing';
import { RegisterPage } from '../pages/register/register';
import { MenuPage } from '../pages/menu/menu';
import { EventsPage } from '../pages/events/events';
import { EventPage } from '../pages/event/event';
import { JobPage } from '../pages/job/job';
import { ProfilePage } from '../pages/profile/profile';
import { AppliedPage } from '../pages/applied/applied';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { NotificationsSettingsPage } from '../pages/notifications-settings/notifications-settings';
import { ReferencesPage } from '../pages/references/references';
import { UsersPage } from '../pages/users/users';
import { ContactsPage } from '../pages/contacts/contacts';
import { ContactchatsPage } from '../pages/contactchats/contactchats';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';

import { HeaderComponent } from '../components/header/header';
import { EventsComponent } from '../components/events/events';
import { JobsComponent } from '../components/jobs/jobs';
import { LoaderComponent } from '../components/loader/loader';
import { AppliedJobsComponent } from '../components/applied-jobs/applied-jobs';
import { FavoriteJobs } from '../components/favorite-jobs/favorite-jobs';
import { FavoriteEvents } from '../components/favorite-events/favorite-events';
import { NotificationsComponent } from '../components/notifications/notifications';
import { ResumeComponent } from '../components/resume/resume';

import { UsersProvider } from '../providers/users';
import { InviteesProvider } from '../providers/invitees';
import { JobsProvider } from '../providers/jobs';
import { EventsProvider } from '../providers/events';
import { AuthProvider } from '../providers/auth';
import { FBStorageProvider } from '../providers/storage';
import { UtilProvider } from '../providers/utils';
import { FCMTokensProvider } from '../providers/fcmtokens';
import { NotificationssProvider } from '../providers/notifications';
import { SettingsProvider } from '../providers/settings';
import { AWSStorageProvider } from '../providers/awsStorage';


import { FeaturedPipe } from '../pipes/featured';

import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Camera } from '@ionic-native/camera';

import { PayPal } from '@ionic-native/paypal';
import { RequestsProvider } from '../providers/requests/requests';
import { ChatProvider } from '../providers/chat/chat';

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
    ChangePasswordPage,
    NotificationsSettingsPage,
    ReferencesPage,
    LandingPage,
    FavoriteJobs,
    FavoriteEvents,
    HeaderComponent,
    EventsComponent,
    JobsComponent,
    LoaderComponent,
    AppliedJobsComponent,
    NotificationsComponent,
    ResumeComponent,
    FeaturedPipe,
    UsersPage,
    ContactsPage,
    ContactchatsPage
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
    AppliedPage,
    ChangePasswordPage,
    NotificationsSettingsPage,
    ReferencesPage,
    LandingPage,
    NotificationsComponent,
    ResumeComponent,
    UsersPage,
    ContactsPage,
    ContactchatsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UsersProvider,
    InviteesProvider,
    EventsProvider,
    JobsProvider,
    AuthProvider,
    FBStorageProvider,
    SettingsProvider,
    AWSStorageProvider,
    UtilProvider,
    FCMTokensProvider,
    NotificationssProvider,
    AngularFireAuth,
    AngularFireDatabase,
    FileChooser,
    FilePath,
    File,
    EmailComposer,
    PayPal,
    FCM,
    InAppBrowser,
    Camera,
    UniqueDeviceID,
    RequestsProvider,
    ChatProvider
  ]
})
export class AppModule { }
