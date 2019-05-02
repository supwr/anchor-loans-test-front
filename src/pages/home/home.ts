import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, AlertController, ToastController, ViewController, ModalController, PopoverController, Modal, Alert } from 'ionic-angular';
import { GalleryProvider, Picture } from '../../providers/gallery/gallery';
import { UsersProvider, User } from '../../providers/users/users'; 
import { Storage } from '@ionic/storage';
import {  FileUploader, FileSelectDirective, FileUploaderOptions } from 'ng2-file-upload/ng2-file-upload';
import { BASE_URL, ROLE_ADMIN } from '../../providers/contants/constants';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public gallery = [];
  public user: User | null;
  public isAdmin = false;

  @ViewChild('slides') slides: Slides;

  constructor(public navCtrl: NavController, 
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public changeDetector: ChangeDetectorRef,
    public galleryProvider: GalleryProvider,
    public storage: Storage,
    public popoverController: PopoverController,
    public usersProvider: UsersProvider
    ) {

      
      galleryProvider.loadGallery()
      .then((gallery: Picture[]) => {
        this.gallery = gallery;
      })
      .catch(error => {
        //console.log(error)
      });     
  }

  ionViewWillEnter() {
    this.isUserLoggedIn();
  }

  openLoginModal() {
    let modal = this.modalCtrl.create(LoginModal); 
    modal.onDidDismiss((user: User|any) => {
      if(!!user) {        
        this.user = user.user;        
      }

      this.isUserLoggedIn();
      this.galleryProvider.loadGallery()
      .then((gallery: Picture[]) => {
        this.gallery = gallery;
      })
      .catch(error => {
        //console.log(error)
      });   
      this.changeDetector.detectChanges();

    })
    modal.present()
  }

  likePicture(id) {
    this.galleryProvider.likePicture(id)
    .then((picture: Picture) => {
      this.gallery = this.gallery.map((p) => {
        if(p.id == id) {
          p.likes = picture.likes;
        }

        return p;
      })
    })
    .catch(error => {
      //console.log(error)
    })
  }

  userLikedPic(picture) {
    let liked = false;
    for(let like of picture.likes){
      if(like.user.$oid == this.user.id) {
        liked = true;
      }
    }

    return liked;
  }

  approvePicture(picture) {
    //console.log(picture.approved)
    if(picture.approved === false) {
      this.galleryProvider.approvePicture(picture.id)
      .then((data) => {
        this.gallery = this.gallery.map((p) => {
          if(p.id == picture.id) {
            p.approved = true;
          }
          return p;
        })
      })
      .catch((error) => {
        //console.log(error)
      })
      return true;
    }

    this.galleryProvider.disapprovePicture(picture.id)
    .then((data) => {
      this.gallery = this.gallery.map((p) => {
        if(p.id == picture.id) {
          p.approved = false;
        }
        return p;
      })
    })
    .catch((error) => {
      //console.log(error)
    })
    return true;
  }

  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

  openUploadModal() {
    let user = this.usersProvider.isLoggedIn()
    .then(user => {
      let modal = this.modalCtrl.create(FileUploadModal, {
        token: user.token
      }); 
      modal.onDidDismiss((picture: any) => {
        if(!!picture) {
          //console.log(Object.keys(this.gallery).length)
          this.gallery.push(picture);
          //console.log(Object.keys(this.gallery).length)
        }
      })
      modal.present()
    })
  }

  deleteFile(id) {
    let alert = this.alertCtrl.create({
      title: 'Confirm?',
      message: 'Are you sure you want to remove this file?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            ////console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.galleryProvider.removePicture(id)
            .then(() => {
              this.gallery = this.gallery.filter((p) => {
                if(p.id !== id) {
                  return p
                }
              })
            })
            .catch(() => {})
          }
        }
      ]
    });
    alert.present();
  }

  presentPopover(ev) {

    let popover = this.popoverController.create(PopoverPage,{ }, {cssClass: 'details-popover'});
    popover.onDidDismiss((action: any) => {
      this.isUserLoggedIn();            
      this.galleryProvider.loadGallery()
      .then((gallery: Picture[]) => {
        this.gallery = gallery;
        this.slides.slideTo(0, 1000)
      })
      .catch(error => {
        //console.log(error)
      });   
    })
    popover.present({
      ev: ev
    });

  }
  
  isUserLoggedIn() {
    this.usersProvider.isLoggedIn()
    .then(user => {
      //console.log(user)
      this.user = user;
      if(!!this.user && this.user.role == ROLE_ADMIN){
        this.isAdmin = true;
      }
    })
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
          Login
        </ion-title>         
      </ion-toolbar>    
    </ion-header>
    <ion-content padding>
      <ion-list>

        <ion-item>
          <ion-label floating>Username</ion-label>
          <ion-input type="text" [(ngModel)]="user.username"></ion-input>
        </ion-item>
      
        <ion-item>
          <ion-label floating>Password</ion-label>
          <ion-input type="password" [(ngModel)]="user.password"></ion-input>
        </ion-item>                
      
      </ion-list>

      <ion-footer class="filters-footer" style="padding: 10px !important">      
        <button block ion-button (click)="login()">
          Login
        </button>      
      </ion-footer>
    </ion-content>
    `
})

export class LoginModal {    
  
  private user: User;

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

  login() {
    this.usersProvider.login(this.user)
    .then(user => {
      this.viewCtrl.dismiss({
        user: user
      })
    })
    .catch(error => {      
      let toast = this.toastController.create({
        duration: 5000,
        message: 'Incorrect Login'        
      });
      toast.present();
    })

  }


  dismiss() {
       
    this.viewCtrl.dismiss();    

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
          Picture Upload
        </ion-title>         
      </ion-toolbar>    
    </ion-header>
    <ion-content padding>
      <input type="file" name="file" ng2FileSelect [uploader]="uploader" />
    </ion-content>

    <ion-footer class="filters-footer" style="padding: 10px !important">      
      <button block ion-button (click)="uploader.uploadAll()">
        Upload
      </button>      
    </ion-footer>
    `
})

export class FileUploadModal {    
   
  public file: any;
  public url = BASE_URL.concat("/gallery/upload");
  public uploader: FileUploader;

  public authHeader: Array<{
    name: string;
    value: string;
  }> = [];
  

  @ViewChild('myFile') mylblRef: ElementRef;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public galleryProvider: GalleryProvider,
    public viewCtrl: ViewController,
    public toastController: ToastController
  )
  {

    let token = this.params.get('token');
    this.uploader = new FileUploader(
      {
        url: this.url, 
        isHTML5: true,
        itemAlias: 'file',
        method: 'post',
        authToken: `Bearer ${token}`        
      }
    );
         
    this.uploader.onBeforeUploadItem = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onCompleteItem = (item: any, r: any, status: any, headers: any) => {
      let response = JSON.parse(r);      

      let picture = new Picture();
      picture.id = response["_id"]["$oid"];
      picture.filename = response["filename"];
      picture.approved = !!response["approved"]  ? response["approved"]  : false;
      picture.createdBy = !!response["createdBy"] ? response["createdBy"] : null;
      picture.createdAt = !!response["createdAt"] ? response["createdAt"] : null;
      picture.disapprovedBy = !!response["disapprovedBy"] ? response["disapprovedBy"] : null;
      picture.disapprovedAt = !!response["disapprovedAt"] ? response["disapprovedAt"] : null;
      picture.likes = !!response["likes"] ? response["likes"] : [];

      //console.log(picture)

      let toast = this.toastController.create({
        duration: 1000,
        message: 'Upload Successful'        
      });
      toast.onDidDismiss(() => {
        this.viewCtrl.dismiss(picture)
      });      
      toast.present();
     };     
  }

  ionViewLoaded() {
   
  }


  dismiss() {       
    this.viewCtrl.dismiss();    
  }

}

@Component({
  template: `
       <ion-list class="popover-page">
          <button ion-item (click)="logout()">
            Sair
          </button>         
        </ion-list>
  `
})

export class PopoverPage { 
  constructor(
    public usersProvider: UsersProvider,
    public viewCtrl: ViewController
  ) {

  }

  logout() {
    this.usersProvider.logout();
    this.viewCtrl.dismiss({
      action: 'logout'
    });
  }
}
