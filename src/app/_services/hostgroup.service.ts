import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service';
import { Hostgroup, Host, Service, Customer, Server, ServiceAck, HostLog, ServiceLog, ServiceState, ServiceChange, UserLog } from '../_models/index';
import * as decode from 'jwt-decode';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

@Injectable()
export class HostgroupService {
  //private api_site = 'http://enigma.posdata.it:3000';
  private api_site = 'http://localhost:3000';
  private handleError: HandleError;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService, private router: Router, private httpErrorHandler: HttpErrorHandler) {    
    this.handleError = httpErrorHandler.createHandleError('HostgroupService');
  }

  ngOnInit() {
    
  }

  public getHostgroups(token: string): Observable<Hostgroup[]> {
    let tokenPayload = decode(token);
    return this.http.get<Hostgroup[]>(this.api_site + '/users/' + tokenPayload.data.id + '/sites/hostgroups').pipe(
      map(
    		res => res.map(x => new Hostgroup(x._id, x.name, x.ip, x.port, x.status, x.state, x.description, x.default_group, x.groups, x.hosts_down, x.hosts_pending,
                                               x.hosts_unreachable, x.hosts_up, x.services_crit, x.services_ok, x.services_ack, x.services_unknown,
                                               x.services_warn, x.check_state, '', '', '', 0, ''))
      ),
      catchError(this.handleError('getHostgroups', []))
    );
  }

  public getHostgroup(token: string, id: string): Observable<Hostgroup> {
    let tokenPayload = decode(token);
    return this.http.get<Hostgroup>(this.api_site + '/users/' + tokenPayload.data.id + '/sites/' + id + '/hostgroups').pipe(
      map(
  		  res => new Hostgroup(res._id, res.name, res.ip, res.port, res.status, res.state, res.description, res.default_group, res.groups, res.hosts_down, res.hosts_pending,
                                             res.hosts_unreachable, res.hosts_up, res.services_crit, res.services_ok, res.services_ack, res.services_unknown,
                                             res.services_warn, res.check_state, res.referent_name, res.referent_mail, res.referent_phone, res.notification,
                                             res.user_customer_site_id)
      ),
      catchError(this.handleError('getHostgroup', null))
    );
  }

  public getHosts(ip:string, port: number, host_group_id: string) : Observable<Host[]> {
    return this.http.get<Host[]>(this.api_site + '/hosts/' + host_group_id).pipe(map(
    res => res.map(x => new Host(x._id, x.address, x.alias, x.groups, x.crit, x.ok, x.unknown, x.warn, x.name, ip, port, x.hard_state, '', '', x.acks, x.ack_num))));
  }

  public getCustomerSiteHosts(ip:string, port: number, customer_site_id: string) : Observable<Host[]> {
    return this.http.get<Host[]>(this.api_site + '/customers/' + customer_site_id + '/hosts').pipe(map(
    res => res.map(x => new Host(x._id, x.address, x.alias, x.groups, x.crit, x.ok, x.unknown, x.warn, x.name, ip, port, x.hard_state, '', '', x.acks, 0))));
  }

  public getServices(host_id: string) : Observable<Service[]> {
    return this.http.get<Service[]>(this.api_site + '/services/' + host_id).pipe(map(
    res => res.map(x => new Service(x._id, x.host_id, x.name, x.status, x.age, x.age_min, x.state, x.h_name, x.last_check, x.last_check_min, x.ack, x.host_group_id))));
  }

  public getServiceAck(service_id: string) : Observable<ServiceAck> {
    return this.http.get<ServiceAck>(this.api_site + '/services/' + service_id + '/ack').pipe(map(
    res => new ServiceAck(res._id, res.host_id, res.service_id, res.customer_site_id, res.creator_name, res.message, res.created_at, res.code, res.updated_at)));
  }

  public getACKS() : Observable<ServiceAck[]> {
    return this.http.get<ServiceAck[]>(this.api_site + '/acks/').pipe(map(
    res => res.map(x=> new ServiceAck(x._id, x.host_id, x.service_id, x.customer_site_id, x.creator_name, x.message, x.created_at, x.code, x.updated_at))));
  }

  public deleteServiceAck(service_id: string, ack_id: string): Observable<boolean> {
    return this.http.delete(this.api_site + '/services/' + service_id + '/ack/' + ack_id).pipe(map(
    (response: HttpResponse<any>) => {   
      if(response.body.success)
        return true;
      else
        return false;
    }));
  }

  public deleteCustomer(customer_id: string): Observable<boolean> {
    return this.http.delete(this.api_site + '/customers/' + customer_id).pipe(map(
    (response: HttpResponse<any>) => {   
      if(response.body.success)
        return true;
      else
        return false;
    }));
  }

  public deleteUser(user_id: string): Observable<boolean> {
    return this.http.delete(this.api_site + '/users/' + user_id).pipe(map(
    (response: HttpResponse<any>) => {   
      if(response.body.success)
        return true;
      else
        return false;
    }));
  }

  public deleteCustomerSite(customer_id: string, site_id: string): Observable<boolean> {
    return this.http.delete(this.api_site + '/customers/' + customer_id + '/sites/' + site_id).pipe(map(
    (response: HttpResponse<any>) => {   
      if(response.body.success)
        return true;
      else
        return false;
    }));
  }

  public deleteUserCustomerSite(user_id: string, site_id: string): Observable<boolean> {
    return this.http.delete(this.api_site + '/users/' + user_id + '/sites/' + site_id).pipe(map(
    (response: HttpResponse<any>) => {   
      if(response.body.success)
        return true;
      else
        return false;
    }));
  }

  public getHostLogs(host_id: string) : Observable<HostLog[]> {
    return this.http.get<HostLog[]>(this.api_site + '/hosts/' + host_id + '/logs').pipe(map(
    res => res.map(x => new HostLog(x._id, x.host_id, x.created_at, x.host_num_services_crit, x.host_num_services_ok, x.host_num_services_unknown, x.host_num_services_warn, x.hard_state))));
  }

  public getServiceLogs(service_id: string) : Observable<ServiceLog[]> {
    return this.http.get<ServiceLog[]>(this.api_site + '/services/' + service_id + '/logs').pipe(map(
    res => res.map(x => new ServiceLog(x._id, x.service_id, x.plugin_output, x.service_state, x.service_last_check, x.created_at))));
  }

  /*public setDefaultGroup(token: string, id: number, groupName: string): Observable<boolean> {
    return this.http.put('http://enigma.posdata.it:8085/enigma-api/hostgroups/set/' + id, JSON.stringify({ value: groupName })).map((response: Response) => {
      return true;
    });
  }*/

  public getHostsByState(state: number) : Observable<Host[]> {
    return this.http.get<Host[]>(this.api_site + '/hosts/state/' + state).pipe(map(
    res => res.map(x => new Host(x._id, x.address, x.alias, '', x.crit, x.ok, x.unknown, x.warn, '', '', 0, 0, x.name, x.site, x.acks, x.ack_num))));
  }

  public getCustomers() : Observable<Customer[]> {
    return this.http.get<Customer[]>(this.api_site + '/customers').pipe(map(
    res => res.map(x => new Customer(x._id, x.name, x.customer_code, x.referent_name, x.phone_number, x.email, x.logo))));
  }

  public getCustomer(id: string) : Observable<Server[]> {
    return this.http.get<Server[]>(this.api_site + '/customers/' + id + '/sites').pipe(map(
    res => res.map(x => new Server(x._id, x.description, x.ip_address, x.port_number, ''))));
  }

  public getCustomerSites() : Observable<Server[]> {
    return this.http.get<Server[]>(this.api_site + '/customers/sites/').pipe(map(
    res => res.map(x => new Server(x._id, x.description, x.ip_address, x.port_number, x.customer_name))));
  }

  public getUserSites(id: string) : Observable<Server[]> {
    return this.http.get<Server[]>(this.api_site + '/users/' + id + '/sites').pipe(map(
    res => res.map(x => new Server(x._id, x.description, x.ip_address, x.port_number, x.customer_name))));
  }

  public getHostgroupServicesCount(id: string): Observable<any> {
    return this.http.get<any>(this.api_site + '/hostgroups/' + id + '/services')
    .pipe(map((response: HttpResponse<any>) => {
      return response;
    }));
  }

  public createCustomer(name: string, customer_code: string, referent_name: string, phone_number: string, email: string, logo: any): Observable<any> {
    return this.http.post<any>(this.api_site + '/customers', { name: name, customer_code: customer_code, referent_name: referent_name, phone_number: phone_number, email: email, logo: logo})
    .pipe(map((response: HttpResponse<any>) => {
      return response;
    }));
  }

  public updateCustomer(customer_id: string, name: string, customer_code: string, referent_name: string, phone_number: string, email: string, logo: any): Observable<any> {
    if(logo !== 'invalid') {
      return this.http.patch<any>(this.api_site + '/customers/' + customer_id, { name: name, customer_code: customer_code, referent_name: referent_name, phone_number: phone_number, email: email, logo: logo})
      .pipe(map((response: HttpResponse<any>) => {
        return response;
      }));
    }
    else {
      return this.http.patch<any>(this.api_site + '/customers/' + customer_id, { name: name, customer_code: customer_code, referent_name: referent_name, phone_number: phone_number, email: email})
      .pipe(map((response: HttpResponse<any>) => {
        return response;
      }));
    }
  }

  public updateCustomerSite(customer_site_id: string, description: string, ip_address: string, port_number: number): Observable<any> {
    return this.http.patch<any>(this.api_site + '/customer_sites/' + customer_site_id, { description: description, ip_address: ip_address, port_number: port_number})
    .pipe(map((response: HttpResponse<any>) => {
      return response;
    }));    
  }

  public updateUserCustomerSite(user_customer_site_id: string, notification: number, telegram: number): Observable<any> {
    return this.http.patch<any>(this.api_site + '/user_customer_sites/' + user_customer_site_id, { notification: notification, telegram: telegram })
    .pipe(map((response: HttpResponse<any>) => {
      return response;
    }));    
  }

  public updateUser(user_id: string, firstname: string, lastname: string, username: string, email: string, customer_id: string, role: number, telegram_id: string, phone_number: string, office_number: string): Observable<any> {
    return this.http.patch<any>(this.api_site + '/users/' + user_id, { firstname: firstname, lastname: lastname, username: username, email: email, 
                                                                      customer_id: customer_id, role: role, telegram_id: telegram_id, phone_number: phone_number, office_number: office_number})
    .pipe(map((response: HttpResponse<any>) => {
      return response;
    }));    
  }

  public updateUserProfile(user_id: string, firstname: string, lastname: string, email: string, telegram_id: string, phone_number: string, office_number: string): Observable<any> {
    return this.http.patch<any>(this.api_site + '/users/' + user_id + '/profile', { firstname: firstname, lastname: lastname, email: email, telegram_id: telegram_id, 
                                                                       phone_number: phone_number, office_number: office_number})
    .pipe(map((response: HttpResponse<any>) => {
      return response;
    }));    
  }

  public updateUserPasswordProfile(user_id: string, current_password: string, new_password: string, confirm_password: string): Observable<boolean> {
    return this.http.patch(this.api_site + '/users/' + user_id + '/password', { current_password: current_password, new_password: new_password, confirm_password: confirm_password })
    .pipe(map((response: HttpResponse<any>) => { 
      if(response.status == 200) {
        return true;
      }
      else {
        return false;
      }
    }));
  }

  public updatePassword(token: string, password: string, confirm_password: string): Observable<boolean> {
    return this.http.post(this.api_site + '/users/recover/' + token, { password: password, confirm_password: confirm_password })
    .pipe(map((response: HttpResponse<any>) => { 
      if(response.status == 200) {
        return true;
      }
      else {
        return false;
      }
    }));
  }

  public createUserSite(user_id: string, customer_site_id: string, notification: number, telegram: number, email: number, sms: number): Observable<any> {
    return this.http.post<any>(this.api_site + '/users/sites', { user_id: user_id, customer_site_id: customer_site_id, notification: notification, telegram: telegram, email: email, sms: sms })
    .pipe(map((response: HttpResponse<any>) => {
      return response;
    }));
  }

  public getSchedulerLastCheck(): Observable<any> {
    return this.http.get<any>(this.api_site + '/scheduler_infos/lastcheck')
    .pipe(map((response: HttpResponse<any>) => {
      return response;
    }));
  }

  public getCustomerSiteLastLog(site_id: string): Observable<any> {
    return this.http.get<any>(this.api_site + '/customer_sites/' + site_id + '/state')
    .pipe(map((response: HttpResponse<any>) => {
      return response;
    }));
  }

  public createACK(host_id: string, service_id: string, user_id: string, customer_site_id: string, message: string, created_at: string, code: string): Observable<any> {
    return this.http.post<any>(this.api_site + '/services/' + service_id + '/ack', { host_id: host_id, service_id: service_id, user_id: user_id, customer_site_id: customer_site_id, message: message, created_at: created_at, expired: 0, code: code, updated_at: created_at })
    .pipe(map((response: HttpResponse<any>) => {
      return response;
    }));
  }

  public createServer(description: string, ip_address: string, port_number: number, customer_id: string): Observable<any> {
    return this.http.post<any>(this.api_site + '/customers/' + customer_id + '/sites', { description: description, ip_address: ip_address, port_number: port_number, customer_id: customer_id})
    .pipe(map((response: HttpResponse<any>) => {
      return response;
    }));
  } 

  /*public getServicesByState(state: number) : Observable<ServiceState[]> {
    return this.http.get<ServiceState[]>(this.api_site + '/services/state/' + state).map(
    res => res.map(x => new ServiceState(x._id, x.plugin_output, x.service_state, x.service_last_state_change, x.host_name, x.service_last_check, x.created_at, 
                                         x.service_logs_docs, x.host_logs_docs, x.customer_site_logs_docs, x.customer_logs_docs)));
  }*/

  public getServicesByState(state: number) : Observable<ServiceState[]> {
    return this.http.get<ServiceState[]>(this.api_site + '/services/state/' + state).pipe(map(
    res => res.map(x => new ServiceState(x.customer_name, x.customer_site_description, x.host_alias, x.service_name, x.plugin_output, 
    x.created_at, x.author, x._id, x.service_id, x.code, x.state))));
  }

  public getCustomerSiteServicesByState(id: string, state: number) : Observable<ServiceState[]> {
    return this.http.get<ServiceState[]>(this.api_site + '/customer_sites/' + id + '/services/state/' + state).pipe(map(
    res => res.map(x => new ServiceState(x.customer_name, x.customer_site_description, x.host_alias, x.service_name, x.plugin_output, 
    x.created_at, x.author, x._id, x.service_id, x.code, x.state))));
  }

  public getCustomerSiteHostsByState(id: string, state: number) : Observable<Host[]> {
    return this.http.get<Host[]>(this.api_site + '/customer_sites/' + id + '/hosts/state/' + state).pipe(map(
    res => res.map(x => new Host(x._id, x.address, x.alias, '', x.crit, x.ok, x.unknown, x.warn, '', '', 0, 0, x.name, x.site, x.acks, x.ack_num))));
  }

  public getServicesChange(user_id: string) : Observable<ServiceChange[]> {
    return this.http.get<ServiceChange[]>(this.api_site + '/services/change/user/' + user_id).pipe(map(
    res => res.map(x => new ServiceChange(x.customer_name, x.customer_site_description, x.host_alias, x.service_name, x.plugin_output, x.created_at, x.date, x.time, x.customer_site_id, x.host_group_id))));
  }

  public getSiteServicesChange(site_id: string) : Observable<ServiceChange[]> {
    return this.http.get<ServiceChange[]>(this.api_site + '/services/change/site/' + site_id).pipe(map(
    res => res.map(x => new ServiceChange(x.customer_name, x.customer_site_description, x.host_alias, x.service_name, x.plugin_output, x.created_at, x.date, x.time, x.customer_site_id, x.host_group_id))));
  }

  public updateACK(ack_id: string, service_id: string, message: string, code: string, user_id: string, updated_at: string): Observable<any> {
    return this.http.patch<any>(this.api_site + '/services/' + service_id + '/ack/' + ack_id, { message: message, code: code, user_id: user_id, updated_at: updated_at})
    .pipe(map((response: HttpResponse<any>) => {
      return response;
    }));    
  }

  public getUserLogs(user_id: string, action_type: number) : Observable<UserLog[]> {
    return this.http.get<UserLog[]>(this.api_site + '/user_logs/' + user_id + '/action/' + action_type).pipe(map(
    res => res.map(x => new UserLog(x._id, x.user_id, x.action_type, x.message, x.created_at, x.receiver_id))));
  }
}
