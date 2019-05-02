import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavParams, ViewController, ToastController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ROLE_ADMIN, ROLE_GUEST } from '../providers/contants/constants';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { UsersProvider, User } from '../providers/users/users';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public modalCtrl: ModalController,
    public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openNewUser() {
    let modal = this.modalCtrl.create(NewUserModal); 
    modal.present()
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar>    
        <ion-buttons left>
          <button ion-button icon-only (click)="dismiss()">
            <ion-icon name="close"></ion-icon>
          </button>
        </ion-buttons>
        <ion-title>
          New User
        </ion-title>         
      </ion-toolbar>    
    </ion-header>
    <ion-content padding>
      <ion-list>

        <ion-item>
          <ion-label floating>Full Name</ion-label>
          <ion-input required type="text" [(ngModel)]="user.fullname"></ion-input>
        </ion-item>  

        <ion-item>
          <ion-label floating>Username</ion-label>
          <ion-input required type="text" [(ngModel)]="user.username"></ion-input>
        </ion-item>
      
        <ion-item>
          <ion-label floating>Password</ion-label>
          <ion-input required type="password" [(ngModel)]="user.password"></ion-input>
        </ion-item>      
       
        
        <ion-item>
          <ion-label floating>Email</ion-label>
          <ion-input required type="email" [(ngModel)]="user.email"></ion-input>
        </ion-item>  

        <ion-item style="margin-top:10px;">
          <ion-label>Role</ion-label>
          <ion-select required [(ngModel)]="user.role">
            <ion-option value="{{role_admin}}">Bride/Groom</ion-option>
            <ion-option selected value="{{role_guest}}">Guest</ion-option>
          </ion-select>
        </ion-item>
      
      </ion-list>

      <ion-footer class="filters-footer" style="padding: 10px !important">      
        <button block ion-button (click)="register()">
          Create User
        </button>      
      </ion-footer>
    </ion-content>
    `
})

export class NewUserModal {    
  
  private user: User;
  private role_admin = ROLE_ADMIN;
  private role_guest = ROLE_GUEST;

  constructor(
    public platform: Platform,
    public usersProvider: UsersProvider,
    public params: NavParams,
    public toastController: ToastController,
    public viewCtrl: ViewController
  )
  {
    this.user = new User;     
  }

  ionViewLoaded() {
    
  }

  register() {
    this.usersProvider.register(this.user)
    .then(user => {
      let toast = this.toastController.create({
        duration: 5000,
        message: 'User created succesfully!'        
      });
      toast.onDidDismiss(() => {
        this.viewCtrl.dismiss()
      });
      toast.present();      
    })
    .catch(error => {      
      let toast = this.toastController.create({
        duration: 5000,
        message: 'An error occured, try again later.'        
      });
      toast.present();
    })

  }


  dismiss() {
       
    this.viewCtrl.dismiss();    

  }

}
