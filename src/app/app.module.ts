import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MyApp, NewUserModal } from './app.component';
import { HomePage, FileUploadModal, LoginModal, PopoverPage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CountPipe } from '../pipes/count/count';
import { IonicStorageModule } from '@ionic/storage';
import { GalleryProvider, Picture } from '../providers/gallery/gallery';
import { UsersProvider } from '../providers/users/users';
import { FileUploadModule } from 'ng2-file-upload/file-upload/file-upload.module';

@NgModule({
  declarations: [
    MyApp,
    CountPipe,
    HomePage,    
    FileUploadModal,
    NewUserModal,
    PopoverPage,
    LoginModal,
    ListPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FileUploadModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__wedding-gallery',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FileUploadModal,
    NewUserModal,
    LoginModal,
    PopoverPage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},    
    GalleryProvider,
    FileTransfer,     
    FileTransferObject,
    UsersProvider
  ]
})
export class AppModule {}
