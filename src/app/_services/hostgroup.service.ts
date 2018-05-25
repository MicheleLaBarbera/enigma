import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { AuthenticationService } from '../_services/authentication.service';
import { Hostgroup, Host, Service } from '../_models/index';

@Injectable()
export class HostgroupService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {}

  public getHostgroups(token: string): Observable<Hostgroup[]> {
    return this.http.post<Hostgroup[]>('http://192.168.5.86/api/hostgroups/get', JSON.stringify({ token: token })).map(
  		res => res.map(x => new Hostgroup(x.id, x.name, x.ip, x.port, x.status, x.state, x.description, x.default_group, x.groups, x.hosts_down, x.hosts_pending,
                                             x.hosts_unreachable, x.hosts_up, x.services_crit, x.services_ok, x.services_pending, x.services_unknown,
                                             x.services_warn)));
  }

  public getHostgroup(token: string, id: number): Observable<Hostgroup[]> {
    return this.http.post<Hostgroup[]>('http://192.168.5.86/api/hostgroups/get/' + id, JSON.stringify({ token: token, id: id })).map(
  		res => res.map(x => new Hostgroup(x.id, x.name, x.ip, x.port, x.status, x.state, x.description, x.default_group, x.groups, x.hosts_down, x.hosts_pending,
                                             x.hosts_unreachable, x.hosts_up, x.services_crit, x.services_ok, x.services_pending, x.services_unknown,
                                             x.services_warn)));
  }

  public getHosts(ip:string, port: number, group: string) : Observable<Host[]> {
    return this.http.post<Host[]>('http://192.168.5.86/api/hosts/get', JSON.stringify({ ip: ip, port: port, group: group })).map(
    res => res.map(x => new Host(x.address, x.alias, x.groups, x.crit, x.ok, x.unknown, x.warn, x.name, ip, port)));
  }

  public getServices(ip:string, port: number, name: string) : Observable<Service[]> {
    return this.http.post<Service[]>('http://192.168.5.86/api/services/get', JSON.stringify({ ip: ip, port: port, name: name })).map(
    res => res.map(x => new Service(x.name, x.status, x.age, x.state, x.h_name)));
  }

  public setDefaultGroup(token: string, id: number, groupName: string): Observable<boolean> {
    return this.http.put('http://192.168.5.86/api/hostgroups/set/' + id, JSON.stringify({ value: groupName })).map((response: Response) => {
      return true;
    });
  }

  public getHostsByState(state: number) : Observable<Host[]> {
    return this.http.post<Host[]>('http://192.168.5.86/api/hosts/state', JSON.stringify({ state: state })).map(
    res => res.map(x => new Host(x.address, x.alias, '', x.crit, x.ok, x.unknown, x.warn, '', '', 0)));
  }
}
