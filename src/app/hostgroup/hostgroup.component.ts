import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgForm } from '@angular/forms';

import { User } from '../_models/index';
import { AlertService, HostgroupService } from '../_services/index';
import { Hostgroup, Host, Service, ServiceAck } from '../_models/index';

import {IMyDpOptions} from 'mydatepicker';
import * as Chartist from 'chartist';
import { AmazingTimePickerService } from 'amazing-time-picker';

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
  @ViewChild('f') form: any;
  model: any = {};
  loading = false;
  public token: string;
  public hostgroup: Hostgroup;
  public hosts: Host[];
  public services: Service[];
  public service_ack: ServiceAck;

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

  public refreshedACK: Service;

  p: number = 1;

  public today = new Date();
  public selectedTime = this.today.getHours() + ':' + this.today.getMinutes();

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy-mm-dd',
    inline: false,
    dayLabels: {su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mer', th: 'Gio', fr: 'Ven', sa: 'Sab'},
    monthLabels: { 1: 'Gen', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'Mag', 6: 'Giu', 7: 'Lug', 8: 'Ago', 9: 'Set', 10: 'Ott', 11: 'Nov', 12: 'Dic' },    
    disableUntil: { year: this.today.getFullYear(), month: this.today.getMonth(), day: this.today.getDate() },
    todayBtnTxt: 'Oggi'
  };
  
  public today_year = this.today.getFullYear();
  public today_month = (this.today.getMonth() + 1);
  public today_day = (this.today.getDate());

  public date_model: any = {     
    date: { year: this.today_year, month: this.today_month, day: this.today_day },
  };

  constructor(private atp: AmazingTimePickerService, private route: ActivatedRoute, private alertService: AlertService, private hostgroupService: HostgroupService) {
  	this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  	this.token = this.currentUser && this.currentUser.token;
  }

  open() {
    const amazingTimePicker = this.atp.open({
      time:  this.selectedTime,
      theme: 'dark',
      arrowStyle: {
          background: 'red',
          color: 'white'
      }
    });
    amazingTimePicker.afterClose().subscribe(time => {
        this.selectedTime = time;
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    const id2 = this.route.snapshot.paramMap.get('id2');
    console.log("ID: " + id + "- ID2: " + id2);

  	this.hostgroupService.getHostgroup(this.token, id).subscribe(hostgroup => {
      this.hostgroup = hostgroup;

      //for(let this.hostgroup of this.hostgroup) {
        this.hosts_down += this.hostgroup['hosts_down'];
        this.hosts_unreachable += this.hostgroup['hosts_unreachable'];
        this.hosts_pending += this.hostgroup['hosts_pending'];
        this.hosts_up += this.hostgroup['hosts_up'];

        this.services_crit += this.hostgroup['services_crit'];
        this.services_ok += this.hostgroup['services_ok'];
        this.services_pending += this.hostgroup['services_pending'];
        this.services_unknown += this.hostgroup['services_unknown'];
        this.services_warn += this.hostgroup['services_warn'];

        for(let group of this.hostgroup.groups) {
          if(id2 == group['_id']) {
            this.getHosts(this.hostgroup, group, this.hostgroup['ip'], this.hostgroup['port'], id2);
          }
        }
        /*if(id2 == 0) {
          let found = false;

          for(let group of this.hostgroup.groups) {
            if(this.hostgroup['default_group'] == group['name'])
            {
              this.getHosts(this.hostgroup, group, this.hostgroup['ip'], this.hostgroup['port'], id2);
              found = true;
            }
          }

          if(!found) {
            console.log(this.hostgroup);
            console.log(this.hostgroup.groups[0]);
            console.log(this.hostgroup['ip']);
            console.log(this.hostgroup['port']);
            console.log(this.hostgroup.groups[0]['name']);
            console.log(this.hostgroup.default_group);
            this.getHosts(this.hostgroup, this.hostgroup.groups[0], this.hostgroup['ip'], this.hostgroup['port'], id2);
          }
        }
        else {
          let idx = 1;
          for(let group of this.hostgroup.groups) {
            if(id2 == idx)
            {
              this.getHosts(this.hostgroup, group, this.hostgroup['ip'], this.hostgroup['port'], id2);
            }
            idx++;
          }
        }*/

      //}

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

  public getHosts(hostgroup: Hostgroup, groupID: any, ip:string, port: number, id: string) {
    this.hostgroupService.getHosts(ip, port, id).subscribe(hosts => {
      this.hosts = hosts;
      this.viewMainTitle = groupID.alias;
      this.switchState(hostgroup);
      //hostgroup.toggleGroupState(groupID);
    });
  }

  public refreshACK(ack: Service) {
    this.refreshedACK = ack;
  }

  public createACK(ack: Service, user_id: string, form: NgForm) {    
    let d = new Date();
    let check_year = d.getFullYear();
    let check_month: any;
    check_month = d.getMonth() + 1;
    check_month = (check_month <= 9) ? "0" + check_month : check_month;
    let check_day: any;
    check_day = d.getDate();
    check_day = (check_day <= 9) ? "0" + check_day : check_day;
    let check_hours = "0" + d.getHours();
    let check_minutes = "0" + d.getMinutes();
    let check_seconds = "0" + d.getSeconds();
    let check_formattedTime = check_year + '-' + check_day + '-' + check_month;
    let check_formattedTime_ex = check_hours.substr(-2) + ':' + check_minutes.substr(-2) + ':' + check_seconds.substr(-2);
    
    let final = check_formattedTime + ' ' + check_formattedTime_ex;

    this.hostgroupService.createACK(ack._id, user_id, this.model.message, final).subscribe(response => {
      console.log(this.date_model);
      if(response.status == 201) {
        this.alertService.success('ACK modificato con successo.');
        this.loading = false;

        this.refreshedACK.ack = response.body.message;
        if(form.valid) {
          form.reset();
        }
      }
      else {
        this.alertService.error(response.body.message);
        this.loading = false;
      }
    });       
  }

  public getServices(ip:string, port: number, host_id: string, alias: string) {
    this.hostgroupService.getServices(ip, port, host_id).subscribe(services => {
      this.services = services;

      /*for(let service of this.services) {
        this.getServiceAcks(service);
      }*/
    });
    this.viewSecondaryTitle = alias;
  }

  //public getServiceAcks(service: Service) {
    //console.log(service.ack.)
    //this.hostgroupService.getServiceAck(service._id).subscribe(service.ack => this.service_ack = service.ack);
  //}

  public switchState(hostgroup: Hostgroup) {
    for(let group of hostgroup.groups) {
      if(group['state'] === 'active')
      group['state'] = 'inactive';
      //hostgroup.state = (this.globalState == 'active') ? 'active' : 'inactive';
    }
  }

  /*public setDefaultGroup(hostgroup: Hostgroup, groupID: any) {
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
  }*/
}
