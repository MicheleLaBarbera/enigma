import { Component, OnInit } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { User } from '../_models/index';
import { HostgroupService } from '../_services/index';
import { Hostgroup, Host, Service, ServiceState } from '../_models/index';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('hostgroupState', [
      state('inactive', style({ height: '0px', visibility: 'hidden' })),
      state('active',   style({ height: '100%', visibility: 'visible' })),
      transition('inactive => active', animate('1ms ease-in')),
      transition('active => inactive', animate('1ms ease-out'))
    ]),
    trigger('globalState', [
      state('inactive', style({ height: '0px', visibility: 'hidden' })),
      state('active',   style({ height: '100%', visibility: 'visible' })),
      transition('inactive => active', animate('1ms ease-in')),
      transition('active => inactive', animate('1ms ease-out'))
    ])
  ]
})
export class HomeComponent implements OnInit {

	public token: string;
  public hostgroups: Hostgroup[];
  public hosts: Host[];
  public services_state: ServiceState[];
  public services_change: ServiceState[];
  //public hosts: Host[];
  //public services: Service[];
  public globalState: string;
  public host_chart = [];
  public service_chart = [];

  public hosts_down = 0;
  public hosts_unreachable = 0;
  public hosts_pending = 0;
  public hosts_up = 0;
  public hosts_count = 0;

  public services_crit = 0;
  public services_ok = 0;
  public services_pending = 0;
  public services_unknown = 0;
  public services_warn = 0;
  public services_count = 0;

  public modalPanelTitle: string;
  public modalPanelState: number;

  public tservices_crit: number = 0;
  public tservices_ok: number = 0;
  public tservices_pending: number = 0;
  public tservices_unknown: number = 0;
  public tservices_warn: number = 0;
  public tservices_ack: number = 0;

  page_host: number = 1;
  page_service: number = 1;
  page_service_change: number = 1;
  public currentUser: User;

  host_loading = false;
  service_loading = false;

  public refreshPanelTimer;

  constructor(private hostgroupService: HostgroupService) {
  	this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  	this.token = this.currentUser && this.currentUser.token;
  }

  ngOnInit() {
    this.hostgroupService.getHostgroups(this.token).subscribe(hostgroups => {
      this.hostgroups = hostgroups;

      this.tservices_crit = 0;
      this.tservices_ok = 0;
      this.tservices_pending = 0;
      this.tservices_unknown = 0;
      this.tservices_warn = 0;
      this.tservices_ack = 0;
      

      for(let single of this.hostgroups) {

        /*this.hostgroupService.getHostgroupServicesCount(single._id).subscribe(elements => {
          this.tservices_crit += elements.services_crit;
          this.tservices_ok += elements.services_ok;            
          this.tservices_unknown += elements.services_unkn;
          this.tservices_warn += elements.services_warn;
          this.tservices_ack += elements.services_ack;
          this.services_count += (elements.services_crit + elements.services_ok + elements.services_unkn + elements.services_warn);
          //console.log(elements);
        });*/

        /*this.hostgroupService.getCustomerSiteHosts(single['ip'], single['port'], single['_id']).subscribe(hosts => {
          console.log(hosts);
        });*/
        

        /*for(let group of single.groups) {     
          this.hostgroupService.getHostgroupServicesCount(group['_id']).subscribe(elements => {
            this.tservices_crit += elements.services_crit;
            this.tservices_ok += elements.services_ok;            
            this.tservices_unknown += elements.services_unkn;
            this.tservices_warn += elements.services_warn;
            this.tservices_ack += elements.services_ack;
            this.services_count += (elements.services_crit + elements.services_ok + elements.services_unkn + elements.services_warn);
            //console.log(elements);
          });
          //  this.getHosts(single, group, single['ip'], single['port'], group['_id']); 
        }*/

        this.hosts_down += single['hosts_down'];
        this.hosts_unreachable += single['hosts_unreachable'];
        this.hosts_pending += single['hosts_pending'];
        this.hosts_up += single['hosts_up'];

        this.services_crit += single['services_crit'];
        this.services_ok += single['services_ok'];
        this.services_pending += single['services_pending'];
        this.services_unknown += single['services_unknown'];
        this.services_warn += single['services_warn'];
      }

      /*this.host_chart = new Chartist.Pie('.hosts-chart', {
        series: [
          {value: this.hosts_up, className: 'ct-host-up'},
          {value: this.hosts_pending, className: 'ct-host-pending'},
          //{value: this.hosts_unreachable, className: 'ct-host-unreachable'},
          {value: this.hosts_down + this.hosts_unreachable, className: 'ct-host-down'}
        ],
      }, {
        donut: true,
        donutWidth: 60,
        donutSolid: true,
        startAngle: 270,
        showLabel: false
      });

      this.service_chart = new Chartist.Pie('.services-chart', {
        series: [
          {value: this.services_ok, className: 'ct-service-ok'},
          {value: this.services_pending, className: 'ct-service-pending'},
          {value: this.services_warn + this.services_unknown, className: 'ct-service-warn'},
          //{value: this.services_unknown, className: 'ct-service-unknown'},
          {value: this.services_crit, className: 'ct-service-crit'}
        ],
      }, {
        donut: true,
        donutWidth: 60,
        donutSolid: true,
        startAngle: 270,
        showLabel: false
      });*/

      this.hosts_count = this.hosts_up + this.hosts_pending + this.hosts_unreachable + this.hosts_down;  
      this.services_count = this.services_ok + this.services_crit + this.services_warn + this.services_unknown;      
    });
    this.globalState = 'active';
    this.getServicesChange();
    this.refreshPanelTimer = setInterval( () => {     
      this.getServicesChange();
    }, 30000);
   
  }

  ngOnDestroy() {
    if (this.refreshPanelTimer) {
      clearInterval(this.refreshPanelTimer);
    }
  }

  public getHosts(hostgroup: Hostgroup, groupID: any, ip:string, port: number, id: string) {
    let local_crit = 0;
    let local_ok = 0;
    let local_pending = 0;
    let local_unknown = 0;
    let local_warn = 0;
    this.hostgroupService.getHosts(ip, port, id).subscribe(hosts => {  
      //console.log(hosts + "ID: ", id);       
      for(let host of hosts) {
        local_crit += parseInt(host.crit);
        local_ok += parseInt(host.ok);    
        local_unknown += parseInt(host.unknown);
        local_warn += parseInt(host.warn);

        this.tservices_crit += parseInt(host.crit);
        this.tservices_ok += parseInt(host.ok);    
        this.tservices_unknown += parseInt(host.unknown);
        this.tservices_warn += parseInt(host.warn);
        this.tservices_ack += host.acks;
      }
      if(local_crit > 0)
        groupID['worst_service_state'] = 2;
      else if(local_unknown > 0)
        groupID['worst_service_state'] = 3;
      else if(local_warn > 0)
        groupID['worst_service_state'] = 1;
      else
        groupID['worst_service_state'] = 0;
    });
  }

  public getHostsByState(state: number, title: string) {
    this.host_loading = true;
    this.modalPanelTitle = title;
    this.modalPanelState = state;    
    this.hosts = undefined;
    this.hostgroupService.getHostsByState(state).subscribe(hosts => {
      this.hosts = hosts;  
      this.host_loading = false; 
    });    
  }

  public getServicesByState(state: number, title: string) {
    this.service_loading = true;
    this.modalPanelState = state;   
    //console.log(this.modalPanelState);
    this.modalPanelTitle = title;
    this.services_state = undefined;
    this.hostgroupService.getServicesByState(state).subscribe(services_state => {
      this.services_state = services_state;  
      this.service_loading = false; 
    });    
  }

  public getServicesChange() {    
    this.hostgroupService.getServicesChange().subscribe(services_change => {
      //console.log("refreshed");
      this.services_change = services_change;      
    });    
  }

  /*public getServices(ip:string, port: number, name: string) {
    this.hostgroupService.getServices(ip, port, name).subscribe(services => this.services = services);
  }*/

  public switchState(hostgroups: Hostgroup[]) {
    this.globalState = (this.globalState == 'active') ? 'inactive' : 'active';
    for(let hostgroup of hostgroups) {
      hostgroup.state = (this.globalState == 'active') ? 'active' : 'inactive';
    }
  }

  public filter(itemList: Hostgroup[]): Hostgroup[] {
    let result: Hostgroup[] = [];

    for(let item of itemList) {
      if(item.status != 'offline' && item.groups != undefined) {
        result.push(item);
      }
    }
    return result;
  }

  public filter_ex(itemList: Host[]): Host[] {
    let result: Host[] = [];

    for(let item of itemList) {
      if(item.alias != 'undefined') {
        result.push(item);
      }
    }
    return result;
  }
}
