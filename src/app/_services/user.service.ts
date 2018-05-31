import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { User } from '../_models/index';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }

  public getUsers() : Observable<User[]>  {
    return this.http.get<User[]>('http://localhost/enigma-api/users/get').map(
    res => res.map(x => new User(x.id, x.username, x.firstname, x.lastname, '', x.companyname)));
  }
}
