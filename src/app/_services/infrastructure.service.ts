import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { AuthenticationService } from '../_services/authentication.service';
import { Infrastructure, Host, Service } from '../_models/index';

@Injectable()
export class InfrastructureService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {}

  public getInfrastructures(token: string): Observable<Infrastructure[]> {
    return this.http.get<Infrastructure[]>('http://localhost/api/infrastructures/get').map(
  		res => res.map(x => new Infrastructure(x.id, x.name, x.ip, x.port, x.status, x.state, x.description, x.hostgroups, x.hosts_down, x.hosts_pending,
                                             x.hosts_unreachable, x.hosts_up, x.services_crit, x.services_ok, x.services_pending, x.services_unknown,
                                             x.services_warn)));
  }

  public getHosts(ip:string, port: number, group: string) : Observable<Host[]> {
    return this.http.post<Host[]>('http://localhost/api/hosts/get', JSON.stringify({ ip: ip, port: port, group: group })).map(
    res => res.map(x => new Host(x.address, x.alias, x.groups, x.crit, x.ok, x.unknown, x.warn, x.name, ip, port)));
  }

  public getServices(ip:string, port: number, name: string) : Observable<Service[]> {
    return this.http.post<Service[]>('http://localhost/api/services/get', JSON.stringify({ ip: ip, port: port, name: name })).map(
    res => res.map(x => new Service(x.name, x.status, x.age, x.state, x.h_name)));
  }
}
