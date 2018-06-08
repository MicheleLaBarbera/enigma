import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { AuthenticationService } from '../_services/authentication.service';
import { Hostgroup, Host, Service, Customer, Server } from '../_models/index';

@Injectable()
export class HostgroupService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {}

  public getHostgroups(token: string): Observable<Hostgroup[]> {
    return this.http.post<Hostgroup[]>('http://localhost/enigma-api/hostgroups/get', JSON.stringify({ token: token })).map(
  		res => res.map(x => new Hostgroup(x.id, x.name, x.ip, x.port, x.status, x.state, x.description, x.default_group, x.groups, x.hosts_down, x.hosts_pending,
                                             x.hosts_unreachable, x.hosts_up, x.services_crit, x.services_ok, x.services_pending, x.services_unknown,
                                             x.services_warn)));
  }

  public getHostgroup(token: string, id: number): Observable<Hostgroup[]> {
    return this.http.post<Hostgroup[]>('http://localhost/enigma-api/hostgroups/get/' + id, JSON.stringify({ token: token, id: id })).map(
  		res => res.map(x => new Hostgroup(x.id, x.name, x.ip, x.port, x.status, x.state, x.description, x.default_group, x.groups, x.hosts_down, x.hosts_pending,
                                             x.hosts_unreachable, x.hosts_up, x.services_crit, x.services_ok, x.services_pending, x.services_unknown,
                                             x.services_warn)));
  }

  public getHosts(ip:string, port: number, group: string) : Observable<Host[]> {
    return this.http.post<Host[]>('http://localhost/enigma-api/hosts/get', JSON.stringify({ ip: ip, port: port, group: group })).map(
    res => res.map(x => new Host(x.address, x.alias, x.groups, x.crit, x.ok, x.unknown, x.warn, x.name, ip, port, x.hard_state)));
  }

  public getServices(ip:string, port: number, name: string) : Observable<Service[]> {
    return this.http.post<Service[]>('http://localhost/enigma-api/services/get', JSON.stringify({ ip: ip, port: port, name: name })).map(
    res => res.map(x => new Service(x.name, x.status, x.age, x.state, x.h_name, x.last_check)));
  }

  public setDefaultGroup(token: string, id: number, groupName: string): Observable<boolean> {
    return this.http.put('http://localhost/enigma-api/hostgroups/set/' + id, JSON.stringify({ value: groupName })).map((response: Response) => {
      return true;
    });
  }

  public getHostsByState(state: number) : Observable<Host[]> {
    return this.http.post<Host[]>('http://localhost/enigma-api/hosts/state', JSON.stringify({ state: state })).map(
    res => res.map(x => new Host(x.address, x.alias, '', x.crit, x.ok, x.unknown, x.warn, '', '', 0, 0)));
  }

  public getCustomers() : Observable<Customer[]> {
    return this.http.get<Customer[]>('http://localhost/enigma-api/customers/get').map(
    res => res.map(x => new Customer(x.id, x.name, x.logo)));
  }

  public getCustomer(id: number) : Observable<Server[]> {
    return this.http.get<Server[]>('http://localhost/enigma-api/customers/get/' + id).map(
    res => res.map(x => new Server(x.id, x.description, x.ip_address, x.port_number)));
  }

  public createCustomer(name: string, logo: any): Observable<any> {
    return this.http.post<any>('http://localhost/enigma-api/customers/create', JSON.stringify({ name: name, logo: logo}))
    .map((response: HttpResponse<any>) => {
      return response;
    });
  }

  public createServer(description: string, address: string, port: number, customer_id: number): Observable<any> {
    return this.http.post<any>('http://localhost/enigma-api/hostgroups/create', JSON.stringify({ description: description, address: address, port: port, customer_id: customer_id}))
    .map((response: HttpResponse<any>) => {
      return response;
    });
  }
}
