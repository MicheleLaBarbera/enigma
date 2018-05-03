import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { User } from '../_models/index';
import { InfrastructureService } from '../_services/index';
import { Infrastructure, Host, Service } from '../_models/index';
import * as Chartist from 'chartist';
//import 'chartist-plugin-tooltips';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('infrastructureState', [
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
  public infrastructures: Infrastructure[];
  public hosts: Host[];
  public services: Service[];
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

  constructor(private infrastructureService: InfrastructureService) {
  	var currentUser = JSON.parse(localStorage.getItem('currentUser'));
  	this.token = currentUser && currentUser.token;
  }

  ngOnInit() {
  	this.infrastructureService.getInfrastructures(this.token).subscribe(infrastructures => {
      this.infrastructures = infrastructures;

      for(let single of this.infrastructures) {
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

      /*this.host_chart = new Chartist.Bar('.hosts-chart', {
        labels: ["Up", "Down", "Irraggiungibili", "In attesa"],
        series: [
          {value: this.hosts_up, className: 'ct-host-up'},
          {value: this.hosts_down, className: 'ct-host-down'},
          {value: this.hosts_unreachable, className: 'ct-host-unreachable'},
          {value: this.hosts_pending, className: 'ct-host-pending'}
        ],
      }, {
        distributeSeries: true
      });*/

      /*this.service_chart = new Chartist.Bar('.services-chart', {
        labels: ["Ok", "In attesa", "Warn", "Sconosciuti", "Crit"],
        series: [
          {value: services_ok, className: 'ct-service-ok'},
          {value: services_pending, className: 'ct-service-pending'},
          {value: services_warn, className: 'ct-service-warn'},
          {value: services_unknown, className: 'ct-service-unknown'},
          {value: services_crit, className: 'ct-service-crit'}
        ],
      }, {
        distributeSeries: true
      });*/

      this.host_chart = new Chartist.Pie('.hosts-chart', {
        series: [
          {value: this.hosts_up, className: 'ct-host-up'},
          {value: this.hosts_pending, className: 'ct-host-pending'},
          {value: this.hosts_unreachable, className: 'ct-host-unreachable'},
          {value: this.hosts_down, className: 'ct-host-down'}
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
          {value: this.services_warn, className: 'ct-service-warn'},
          {value: this.services_unknown, className: 'ct-service-unknown'},
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

  public getHosts(ip:string, port: number, group: string) {
    this.infrastructureService.getHosts(ip, port, group).subscribe(hosts => this.hosts = hosts);
  }

  public getServices(ip:string, port: number, name: string) {
    this.infrastructureService.getServices(ip, port, name).subscribe(services => this.services = services);
  }

  public switchState(infrastructures: Infrastructure[]) {
    this.globalState = (this.globalState == 'active') ? 'inactive' : 'active';
    for(let infrastructure of infrastructures) {
      infrastructure.state = (this.globalState == 'active') ? 'active' : 'inactive';
    }
  }


}
