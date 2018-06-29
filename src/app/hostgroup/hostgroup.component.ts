import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { User } from '../_models/index';
import { HostgroupService } from '../_services/index';
import { Hostgroup, Host, Service } from '../_models/index';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-hostgroup',
  templateUrl: './hostgroup.component.html',
  styleUrls: ['./hostgroup.component.css'],
  animations: [
    trigger('groupState', [
      state('inactive', style({ height: '0px', visibility: 'hidden' })),
      state('active',   style({ height: '100%', visibility: 'visible' })),
      transition('inactive => active', animate('1ms ease-in')),
      transition('active => inactive', animate('1ms ease-out'))
    ])
  ]
})
export class HostgroupComponent implements OnInit {

  public token: string;
  public hostgroup: Hostgroup[];
  public hosts: Host[];
  public services: Service[];

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

  public viewMainTitle: string;
  public viewSecondaryTitle: string;

  public currentUser: User;

  constructor(private route: ActivatedRoute, private hostgroupService: HostgroupService) {
  	this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  	this.token = this.currentUser && this.currentUser.token;
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    const id2 = +this.route.snapshot.paramMap.get('id2');
    console.log("ID: " + id + "- ID2: " + id2);

  	this.hostgroupService.getHostgroup(this.token, id).subscribe(hostgroup => {
      this.hostgroup = hostgroup;

      for(let single of this.hostgroup) {
        this.hosts_down += single['hosts_down'];
        this.hosts_unreachable += single['hosts_unreachable'];
        this.hosts_pending += single['hosts_pending'];
        this.hosts_up += single['hosts_up'];

        this.services_crit += single['services_crit'];
        this.services_ok += single['services_ok'];
        this.services_pending += single['services_pending'];
        this.services_unknown += single['services_unknown'];
        this.services_warn += single['services_warn'];

        if(id2 == 0) {
          let found = false;

          for(let group of single.groups) {
            if(single['default_group'] == group['name'])
            {
              this.getHosts(single, group, single['ip'], single['port'], group['name']);
              found = true;
            }
          }

          if(!found) {
            console.log(single);
            console.log(single.groups[0]);
            console.log(single['ip']);
            console.log(single['port']);
            console.log(single.groups[0]['name']);
            console.log(single.default_group);
            this.getHosts(single, single.groups[0], single['ip'], single['port'], single.groups[0]['name']);
          }
        }
        else {
          let idx = 1;
          for(let group of single.groups) {
            if(id2 == idx)
            {
              this.getHosts(single, group, single['ip'], single['port'], group['name']);
            }
            idx++;
          }
        }

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
  }

  public getHosts(hostgroup: Hostgroup, groupID: any, ip:string, port: number, group: string) {
    this.hostgroupService.getHosts(ip, port, group).subscribe(hosts => {
      this.hosts = hosts;
      this.viewMainTitle = groupID.alias;
      this.switchState(hostgroup);
      hostgroup.toggleGroupState(groupID);
    });
  }

  public getServices(ip:string, port: number, name: string, alias: string) {
    this.hostgroupService.getServices(ip, port, name).subscribe(services => this.services = services);
    this.viewSecondaryTitle = alias;
  }

  public switchState(hostgroup: Hostgroup) {
    for(let group of hostgroup.groups) {
      if(group['state'] === 'active')
      group['state'] = 'inactive';
      //hostgroup.state = (this.globalState == 'active') ? 'active' : 'inactive';
    }
  }

  public setDefaultGroup(hostgroup: Hostgroup, groupID: any) {
    const id = +this.route.snapshot.paramMap.get('id');
    console.log(hostgroup.default_group + " - " + groupID['name']);
    if(hostgroup.default_group != groupID['name']) {
      this.hostgroupService.setDefaultGroup(this.token, id, groupID['name']).subscribe(result => {
        if (result === true) {
          hostgroup.default_group = groupID['name'];
          console.log(hostgroup.default_group + " - " + groupID['name']);
        }
      });
    }
  }
}
