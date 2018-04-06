import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { AuthenticationService } from '../_services/authentication.service';
import { Infrastructure } from '../_models/index';

@Injectable()
export class InfrastructureService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {}

  getInfrastructures(token: string): Observable<Infrastructure[]> {
    return this.http.get<Infrastructure[]>('http://localhost/api/infrastructures/get').map(
  		res => res.map(x => new Infrastructure(x.id, x.name, x.ip, x.port, x.status, x.state, x.description, x.hostgroups)));


    /*.map((response: Response) => {
      if(response) {
        console.log(typeof response['error']);
        if(typeof response['error'] != 'undefined')
          this.authenticationService.logout();

        return true;
      }
      else
        return false;

    });*/
  }
}
