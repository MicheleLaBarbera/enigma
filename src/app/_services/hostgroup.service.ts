import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { AuthenticationService } from '../_services/authentication.service';
import { Hostgroup, Host, Service, Customer, Server, ServiceAck } from '../_models/index';
import * as decode from 'jwt-decode';

@Injectable()
export class HostgroupService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {}

  public getHostgroups(token: string): Observable<Hostgroup[]> {
    let tokenPayload = decode(token);
    return this.http.get<Hostgroup[]>('http://localhost:3000/users/' + tokenPayload.data.id + '/sites/hostgroups').map(
  		res => res.map(x => new Hostgroup(x._id, x.name, x.ip, x.port, x.status, x.state, x.description, x.default_group, x.groups, x.hosts_down, x.hosts_pending,
                                             x.hosts_unreachable, x.hosts_up, x.services_crit, x.services_ok, x.services_pending, x.services_unknown,
                                             x.services_warn)));
  }

  public getHostgroup(token: string, id: string): Observable<Hostgroup> {
    let tokenPayload = decode(token);
    return this.http.get<Hostgroup>('http://localhost:3000/users/' + tokenPayload.data.id + '/sites/' + id + '/hostgroups').map(
  		res => new Hostgroup(res._id, res.name, res.ip, res.port, res.status, res.state, res.description, res.default_group, res.groups, res.hosts_down, res.hosts_pending,
                                             res.hosts_unreachable, res.hosts_up, res.services_crit, res.services_ok, res.services_pending, res.services_unknown,
                                             res.services_warn));
  }

  public getHosts(ip:string, port: number, host_group_id: string) : Observable<Host[]> {
    return this.http.get<Host[]>('http://localhost:3000/hosts/' + host_group_id).map(
    res => res.map(x => new Host(x._id, x.address, x.alias, x.groups, x.crit, x.ok, x.unknown, x.warn, x.name, ip, port, x.hard_state, '', '')));
  }

  public getServices(ip:string, port: number, host_id: string) : Observable<Service[]> {
    return this.http.get<Service[]>('http://localhost:3000/services/' + host_id).map(
    res => res.map(x => new Service(x._id, x.name, x.status, x.age, x.age_min, x.state, x.h_name, x.last_check, x.last_check_min, x.ack)));
  }

  public getServiceAck(service_id: string) : Observable<ServiceAck> {
    return this.http.get<ServiceAck>('http://localhost:3000/services/' + service_id + '/ack').map(
    res => new ServiceAck(res.service_id, res.creator_name, res.message, res.created_at, res.expire_at));
  }

  /*public setDefaultGroup(token: string, id: number, groupName: string): Observable<boolean> {
    return this.http.put('http://localhost:8085/enigma-api/hostgroups/set/' + id, JSON.stringify({ value: groupName })).map((response: Response) => {
      return true;
    });
  }*/

  public getHostsByState(state: number) : Observable<Host[]> {
    return this.http.get<Host[]>('http://localhost:3000/hosts/state/' + state).map(
    res => res.map(x => new Host(x._id, x.address, x.alias, '', x.crit, x.ok, x.unknown, x.warn, '', '', 0, 0, x.name, x.site)));
  }

  public getCustomers() : Observable<Customer[]> {
    return this.http.get<Customer[]>('http://localhost:3000/customers').map(
    res => res.map(x => new Customer(x._id, x.name, x.logo)));
  }

  public getCustomer(id: string) : Observable<Server[]> {
    return this.http.get<Server[]>('http://localhost:3000/customers/' + id + '/sites').map(
    res => res.map(x => new Server(x._id, x.description, x.ip_address, x.port_number)));
  }

  public createCustomer(name: string, logo: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/customers', { name: name, logo: logo})
    .map((response: HttpResponse<any>) => {
      return response;
    });
  }

  public createACK(service_id: string, user_id: string, message: string, created_at: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/services/' + service_id + '/ack', { service_id: service_id, user_id: user_id, message: message, created_at: created_at })
    .map((response: HttpResponse<any>) => {
      return response;
    });
  }

  public createServer(description: string, ip_address: string, port_number: number, customer_id: number): Observable<any> {
    return this.http.post<any>('http://localhost:3000/customers/' + customer_id + '/sites', { description: description, ip_address: ip_address, port_number: port_number, customer_id: customer_id})
    .map((response: HttpResponse<any>) => {
      return response;
    });
  }

  public getHostgroupsByUser(id: string): Observable<Hostgroup[]> {
    return this.http.get<Hostgroup[]>('http://localhost:8085/enigma-api/hostgroups/getUser/' + id).map(
  		res => res.map(x => new Hostgroup(x._id, x.name, x.ip, x.port, x.status, x.state, x.description, x.default_group, x.groups, x.hosts_down, x.hosts_pending,
                                             x.hosts_unreachable, x.hosts_up, x.services_crit, x.services_ok, x.services_pending, x.services_unknown,
                                             x.services_warn)));
  }
}
