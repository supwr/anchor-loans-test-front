import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BASE_URL } from '../../providers/contants/constants';

/*
  Generated class for the UsersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsersProvider {

  constructor(public http: HttpClient, private storage: Storage) {
    //console.log('Hello UsersProvider Provider');
  }

  public isLoggedIn() {
    return this.storage.get('user');      
  }

  public logout(): Promise<any>{
    return this.storage.clear();
  }

  public register(user: User): Promise<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let url = BASE_URL.concat("/register");
  	
  	return new Promise((resolve, reject) => {
	    this.http.post(url, user, {headers}).subscribe((data: any) => {      
	    	
        let user = new User();
        
         	if(data.data.access_token){	    		
	    		
	    		user.id = data.data.user._id["$oid"];
	    		user.email = data.data.user.email;
          user.username = data.data.user.username;
          user.token = data.data.access_token;
          user.fullname = data.data.user.fullname;
          user.role = data.data.user.role;              		

	    	}

	    	resolve(user);

	    },(error) => {            
	      let error_result = error;
	    	reject(error_result);
	    });
    });
  }

  public login(user: User): Promise<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let url = BASE_URL.concat("/login");

  	let postParams = {
      password: user.password,
      username: user.username
    }; 
  	
  	return new Promise((resolve, reject) => {
	    this.http.post(url, postParams, {headers}).subscribe((data: any) => {      
	    	
        let user = new User();
        
        //console.log(data);
        //console.log(data.data.user);
	    		
	    	if(data.data.access_token){	    		
	    		
	    		user.id = data.data.user._id["$oid"];
	    		user.email = data.data.user.email;
          user.username = data.data.user.username;
          user.token = data.data.access_token;
          user.fullname = data.data.user.fullname;
          user.role = data.data.user.role;
          
	    		this.storage.set('user', user);

	    	}

	    	resolve(user);

	    },(error) => {            
	      let error_result = error;
	    	reject(error_result);
	    });
    });

  }

}

export class User {
  id?: string; 
  fullname?: string;
  username: string;
  role?: string;
  email?: string;
  token?: string;
  password?: string;
}
