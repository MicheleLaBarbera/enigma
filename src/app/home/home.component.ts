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
import { Hostgroup, Host, Service } from '../_models/index';
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

  p: number = 1;

  constructor(private hostgroupService: HostgroupService) {
  	var currentUser = JSON.parse(localStorage.getItem('currentUser'));
  	this.token = currentUser && currentUser.token;
  }

  ngOnInit() {
    this.hostgroupService.getHostgroups(this.token).subscribe(hostgroups => {
      this.hostgroups = hostgroups;

      for(let single of this.hostgroups) {
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

      this.host_chart = new Chartist.Pie('.hosts-chart', {
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
      });

      this.hosts_count = this.hosts_up + this.hosts_pending + this.hosts_unreachable + this.hosts_down;
      this.services_count = this.services_ok + this.services_pending + this.services_warn + this.services_unknown + this.services_crit;
    });
    this.globalState = 'active';
  }

  public getHostsByState(state: number, title: string) {
    this.hostgroupService.getHostsByState(state).subscribe(hosts => {
      this.hosts = hosts;
      console.log(this.hosts);
    });
    this.modalPanelTitle = title;
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
}
