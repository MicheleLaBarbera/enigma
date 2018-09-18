import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { AuthenticationService } from '../_services/authentication.service';
import { Hostgroup, Host, Service, Customer, Server, ServiceAck, HostLog, ServiceLog, ServiceState } from '../_models/index';
import * as decode from 'jwt-decode';

@Injectable()
export class HostgroupService {
  //private api_site = 'http://enigma.posdata.it:3000';
  private api_site = 'http://localhost:3000';

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {}


  public getHostgroups(token: string): Observable<Hostgroup[]> {
    let tokenPayload = decode(token);
    return this.http.get<Hostgroup[]>(this.api_site + '/users/' + tokenPayload.data.id + '/sites/hostgroups').map(
  		res => res.map(x => new Hostgroup(x._id, x.name, x.ip, x.port, x.status, x.state, x.description, x.default_group, x.groups, x.hosts_down, x.hosts_pending,
                                             x.hosts_unreachable, x.hosts_up, x.services_crit, x.services_ok, x.services_pending, x.services_unknown,
                                             x.services_warn)));
  }

  public getHostgroup(token: string, id: string): Observable<Hostgroup> {
    let tokenPayload = decode(token);
    return this.http.get<Hostgroup>(this.api_site + '/users/' + tokenPayload.data.id + '/sites/' + id + '/hostgroups').map(
  		res => new Hostgroup(res._id, res.name, res.ip, res.port, res.status, res.state, res.description, res.default_group, res.groups, res.hosts_down, res.hosts_pending,
                                             res.hosts_unreachable, res.hosts_up, res.services_crit, res.services_ok, res.services_pending, res.services_unknown,
                                             res.services_warn));
  }

  public getHosts(ip:string, port: number, host_group_id: string) : Observable<Host[]> {
    return this.http.get<Host[]>(this.api_site + '/hosts/' + host_group_id).map(
    res => res.map(x => new Host(x._id, x.address, x.alias, x.groups, x.crit, x.ok, x.unknown, x.warn, x.name, ip, port, x.hard_state, '', '', x.acks)));
  }

  public getCustomerSiteHosts(ip:string, port: number, customer_site_id: string) : Observable<Host[]> {
    return this.http.get<Host[]>(this.api_site + '/customers/' + customer_site_id + '/hosts').map(
    res => res.map(x => new Host(x._id, x.address, x.alias, x.groups, x.crit, x.ok, x.unknown, x.warn, x.name, ip, port, x.hard_state, '', '', x.acks)));
  }

  public getServices(ip:string, port: number, host_id: string) : Observable<Service[]> {
    return this.http.get<Service[]>(this.api_site + '/services/' + host_id).map(
    res => res.map(x => new Service(x._id, x.host_id, x.name, x.status, x.age, x.age_min, x.state, x.h_name, x.last_check, x.last_check_min, x.ack)));
  }

  public getServiceAck(service_id: string) : Observable<ServiceAck> {
    return this.http.get<ServiceAck>(this.api_site + '/services/' + service_id + '/ack').map(
    res => new ServiceAck(res._id, res.host_id, res.service_id, res.creator_name, res.message, res.created_at));
  }

  public deleteServiceAck(service_id: string, ack_id: string): Observable<boolean> {
    return this.http.delete(this.api_site + '/services/' + service_id + '/ack/' + ack_id).map(
    (response: HttpResponse<any>) => {   
      if(response.body.success)
        return true;
      else
        return false;
    });
  }

  public deleteCustomer(customer_id: string): Observable<boolean> {
    return this.http.delete(this.api_site + '/customers/' + customer_id).map(
    (response: HttpResponse<any>) => {   
      if(response.body.success)
        return true;
      else
        return false;
    });
  }

  public deleteCustomerSite(customer_id: string, site_id: string): Observable<boolean> {
    return this.http.delete(this.api_site + '/customers/' + customer_id + '/sites/' + site_id).map(
    (response: HttpResponse<any>) => {   
      if(response.body.success)
        return true;
      else
        return false;
    });
  }

  public getHostLogs(host_id: string) : Observable<HostLog[]> {
    return this.http.get<HostLog[]>(this.api_site + '/hosts/' + host_id + '/logs').map(
    res => res.map(x => new HostLog(x._id, x.host_id, x.created_at, x.host_num_services_crit, x.host_num_services_ok, x.host_num_services_unknown, x.host_num_services_warn, x.hard_state)));
  }

  public getServiceLogs(service_id: string) : Observable<ServiceLog[]> {
    return this.http.get<ServiceLog[]>(this.api_site + '/services/' + service_id + '/logs').map(
    res => res.map(x => new ServiceLog(x._id, x.service_id, x.plugin_output, x.service_state, x.service_last_check, x.created_at)));
  }

  /*public setDefaultGroup(token: string, id: number, groupName: string): Observable<boolean> {
    return this.http.put('http://enigma.posdata.it:8085/enigma-api/hostgroups/set/' + id, JSON.stringify({ value: groupName })).map((response: Response) => {
      return true;
    });
  }*/

  public getHostsByState(state: number) : Observable<Host[]> {
    return this.http.get<Host[]>(this.api_site + '/hosts/state/' + state).map(
    res => res.map(x => new Host(x._id, x.address, x.alias, '', x.crit, x.ok, x.unknown, x.warn, '', '', 0, 0, x.name, x.site, x.acks)));
  }

  public getCustomers() : Observable<Customer[]> {
    return this.http.get<Customer[]>(this.api_site + '/customers').map(
    res => res.map(x => new Customer(x._id, x.name, x.customer_code, x.referent_name, x.phone_number, x.email, x.logo)));
  }

  public getCustomer(id: string) : Observable<Server[]> {
    return this.http.get<Server[]>(this.api_site + '/customers/' + id + '/sites').map(
    res => res.map(x => new Server(x._id, x.description, x.ip_address, x.port_number, '')));
  }

  public getCustomerSites() : Observable<Server[]> {
    return this.http.get<Server[]>(this.api_site + '/customers/sites/').map(
    res => res.map(x => new Server(x._id, x.description, x.ip_address, x.port_number, x.customer_name)));
  }

  public getUserSites(id: string) : Observable<Server[]> {
    return this.http.get<Server[]>(this.api_site + '/users/' + id + '/sites').map(
    res => res.map(x => new Server(x._id, x.description, x.ip_address, x.port_number, x.customer_name)));
  }

  public getHostgroupServicesCount(id: string): Observable<any> {
    return this.http.get<any>(this.api_site + '/hostgroups/' + id + '/services')
    .map((response: HttpResponse<any>) => {
      return response;
    });
  }

  public createCustomer(name: string, customer_code: string, referent_name: string, phone_number: string, email: string, logo: any): Observable<any> {
    return this.http.post<any>(this.api_site + '/customers', { name: name, customer_code: customer_code, referent_name: referent_name, phone_number: phone_number, email: email, logo: logo})
    .map((response: HttpResponse<any>) => {
      return response;
    });
  }

  public updateCustomer(customer_id: string, name: string, customer_code: string, referent_name: string, phone_number: string, email: string, logo: any): Observable<any> {
    if(logo !== 'invalid') {
      return this.http.patch<any>(this.api_site + '/customers/' + customer_id, { name: name, customer_code: customer_code, referent_name: referent_name, phone_number: phone_number, email: email, logo: logo})
      .map((response: HttpResponse<any>) => {
        return response;
      });
    }
    else {
      return this.http.patch<any>(this.api_site + '/customers/' + customer_id, { name: name, customer_code: customer_code, referent_name: referent_name, phone_number: phone_number, email: email})
      .map((response: HttpResponse<any>) => {
        return response;
      });
    }
  }

  public createUserSite(user_id: string, customer_site_id: string, notification: number, telegram: number, email: number, sms: number): Observable<any> {
    return this.http.post<any>(this.api_site + '/users/sites', { user_id: user_id, customer_site_id: customer_site_id, notification: notification, telegram: telegram, email: email, sms: sms })
    .map((response: HttpResponse<any>) => {
      return response;
    });
  }

  public getSchedulerLastCheck(): Observable<any> {
    return this.http.get<any>(this.api_site + '/scheduler_infos/lastcheck')
    .map((response: HttpResponse<any>) => {
      return response;
    });
  }

  public createACK(host_id: string, service_id: string, user_id: string, message: string, created_at: string): Observable<any> {
    return this.http.post<any>(this.api_site + '/services/' + service_id + '/ack', { host_id: host_id, service_id: service_id, user_id: user_id, message: message, created_at: created_at, expired: 0 })
    .map((response: HttpResponse<any>) => {
      return response;
    });
  }

  public createServer(description: string, ip_address: string, port_number: number, customer_id: string): Observable<any> {
    return this.http.post<any>(this.api_site + '/customers/' + customer_id + '/sites', { description: description, ip_address: ip_address, port_number: port_number, customer_id: customer_id})
    .map((response: HttpResponse<any>) => {
      return response;
    });
  } 

  /*public getServicesByState(state: number) : Observable<ServiceState[]> {
    return this.http.get<ServiceState[]>(this.api_site + '/services/state/' + state).map(
    res => res.map(x => new ServiceState(x._id, x.plugin_output, x.service_state, x.service_last_state_change, x.host_name, x.service_last_check, x.created_at, 
                                         x.service_logs_docs, x.host_logs_docs, x.customer_site_logs_docs, x.customer_logs_docs)));
  }*/

  public getServicesByState(state: number) : Observable<ServiceState[]> {
    return this.http.get<ServiceState[]>(this.api_site + '/services/state/' + state).map(
    res => res.map(x => new ServiceState(x.customer_name, x.customer_site_description, x.host_alias, x.service_name, x.plugin_output, x.created_at)));
  }

  public getServicesChange() : Observable<ServiceState[]> {
    return this.http.get<ServiceState[]>(this.api_site + '/services/change/' + 0).map(
    res => res.map(x => new ServiceState(x.customer_name, x.customer_site_description, x.host_alias, x.service_name, x.plugin_output, x.created_at)));
  }
}
