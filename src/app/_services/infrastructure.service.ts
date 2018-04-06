import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class InfrastructureService {

  constructor(private http: Http, private authenticationService: AuthenticationService) { 
    /*var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;*/
  }

  getInfrastructures(token: string): Observable<boolean> {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);

    let opts = new RequestOptions();
    opts.headers = headers;   

    return this.http.get('http://localhost/api/infrastructures/get', opts)
    .map((response: Response) => {
      let result = response.json();

      if (result) {

        if(result == "Expired token") {
          this.authenticationService.logout();
        }
        /*this.token = token;
        let tokenPayload = decode(token);
        localStorage.setItem('currentUser', JSON.stringify({ id: tokenPayload.data.id, username: username, token: token }));*/
        return true;
      } 
      else {
        return false;
      }
    });
  }
}