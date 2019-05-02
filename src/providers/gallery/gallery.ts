import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../../providers/contants/constants';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Storage } from '@ionic/storage';

/*
  Generated class for the GalleryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GalleryProvider {

  constructor(public http: HttpClient, 
    private transfer: FileTransfer,
    private storage: Storage
    
    ) {
    //console.log('Hello GalleryProvider Provider');
  }

  public async likePicture(id): Promise<Picture> {
    let user = await this.storage.get('user');
    let token = user.token;

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)      

    let url = BASE_URL.concat("/gallery/", id, "/like");

    return this.http.put(url, {}, {headers})
      .toPromise()
      .then((data: any) => {   
        let picture = new Picture();
          
        picture.id = data._id["$oid"];
        picture.filename = data.filename;
        picture.approved = !!data.approved  ? data.approved  : false;
        picture.createdBy = !!data.createdBy ? data.createdBy : null;
        picture.createdAt = !!data.createdAt ? data.createdAt : null;
        picture.disapprovedBy = !!data.disapprovedBy ? data.disapprovedBy : null;
        picture.disapprovedAt = !!data.disapprovedAt ? data.disapprovedAt : null;
        picture.likes = !!data.likes ? data.likes : [];

        return picture;

      })          
  }

  public async approvePicture(id): Promise<Picture> {
    let user = await this.storage.get('user');
    let token = user.token;

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)      

    let url = BASE_URL.concat("/gallery/", id, "/approve");

    return this.http.put(url, {}, {headers})
      .toPromise()
      .then((data: any) => {   
        let picture = new Picture();
          
        picture.id = data._id["$oid"];
        picture.filename = data.filename;
        picture.approved = !!data.approved  ? data.approved  : false;
        picture.createdBy = !!data.createdBy ? data.createdBy : null;
        picture.createdAt = !!data.createdAt ? data.createdAt : null;
        picture.disapprovedBy = !!data.disapprovedBy ? data.disapprovedBy : null;
        picture.disapprovedAt = !!data.disapprovedAt ? data.disapprovedAt : null;
        picture.likes = !!data.likes ? data.likes : [];

        return picture;
        
      })          
  }

  public async disapprovePicture(id): Promise<Picture> {
    let user = await this.storage.get('user');
    let token = user.token;

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)      

    let url = BASE_URL.concat("/gallery/", id, "/disapprove");

    return this.http.put(url, {}, {headers})
      .toPromise()
      .then((data: any) => {   
        let picture = new Picture();
          
        picture.id = data._id["$oid"];
        picture.filename = data.filename;
        picture.approved = !!data.approved  ? data.approved  : false;
        picture.createdBy = !!data.createdBy ? data.createdBy : null;
        picture.createdAt = !!data.createdAt ? data.createdAt : null;
        picture.disapprovedBy = !!data.disapprovedBy ? data.disapprovedBy : null;
        picture.disapprovedAt = !!data.disapprovedAt ? data.disapprovedAt : null;
        picture.likes = !!data.likes ? data.likes : [];

        return picture;
        
      })          
  }

  public async removePicture(id): Promise<Picture> {
    let user = await this.storage.get('user');
    let token = user.token;

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)      

    let url = BASE_URL.concat("/gallery/", id);

    return this.http.delete(url, {headers})
      .toPromise()
      .then((data: any) => {   
        return data        
      })          
  }

  public async loadGallery(): Promise<Picture[]> {
    let user = await this.storage.get('user');    
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json');  
      
    if(!!user) {
      let token = user.token;      
      headers = headers.append('Authorization', `Bearer ${token}`)
    }
  
    let url = BASE_URL.concat("/gallery");

    return this.http.get(url, {headers})
      .toPromise()
      .then((data: any) => {   

        let result = data;        
        let gallery: Picture[] = [];
      
        for(let i in result) {

          let picture = new Picture();
          
          picture.id = result[i]._id["$oid"];
          picture.filename = result[i].filename;
          picture.approved = !!result[i].approved  ? result[i].approved  : false;
          picture.createdBy = !!result[i].createdBy ? result[i].createdBy : null;
          picture.createdAt = !!result[i].createdAt ? result[i].createdAt : null;
          picture.disapprovedBy = !!result[i].disapprovedBy ? result[i].disapprovedBy : null;
          picture.disapprovedAt = !!result[i].disapprovedAt ? result[i].disapprovedAt : null;
          picture.likes = !!result[i].likes ? result[i].likes : [];
          
          gallery.push(picture);                    
          
        }
        
        return gallery;
            
      })  
  }

}

export class Picture {
  id: string;
  filename: string;
  approved: boolean;
  createdBy: string;
  createdAt?: string;
  disapprovedBy?: string;
  disapprovedAt?: string;  
  likes: any;
}
