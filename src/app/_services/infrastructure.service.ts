import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { AuthenticationService } from '../_services/authentication.service';
import { Infrastructure, Service } from '../_models/index';

@Injectable()
export class InfrastructureService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {}

  getInfrastructures(token: string): Observable<Infrastructure[]> {
    return this.http.get<Infrastructure[]>('http://localhost/api/infrastructures/get').map(
  		res => res.map(x => new Infrastructure(x.id, x.name, x.ip, x.port, x.status, x.state, x.description, x.hostgroups)));
  }

  public getServices(ip:string, port: number, group: string) : Observable<Service[]> {
    return this.http.post<Service[]>('http://localhost/api/services/get', JSON.stringify({ ip: ip, port: port, group: group })).map(
    res => res.map(x => new Service(x.address, x.alias, x.groups, x.crit, x.ok, x.unknown, x.warn)));
  }
}
