import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { User } from '../_models/index';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
  private api_site = 'http://enigma.posdata.it:3000';
  //private api_site = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  public getUsers() : Observable<User[]>  {
    return this.http.get<User[]>(this.api_site + '/users').pipe(map(
    res => res.map(x => new User(x._id, x.username, x.firstname, x.lastname, '', x.customer_name, x.email, '', x.role))));
  }
}
