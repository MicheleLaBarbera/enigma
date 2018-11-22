import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgForm } from '@angular/forms';

import { User } from '../_models/index';
import { AlertService, HostgroupService } from '../_services/index';
import { Hostgroup, Host, Service, ServiceAck, HostLog, ServiceLog, ServiceState, ServiceChange } from '../_models/index';

import {IMyDpOptions} from 'mydatepicker';

import { jqxChartComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxchart';

import { ErrorService }  from '../error.service'

@Component({
  selector: 'app-hostgroup',
  templateUrl: './hostgroup.component.html',
  styleUrls: ['./hostgroup.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('0.6s ease-in', style({opacity: 1}))
      ]),
      transition(':leave', [
        animate('0.6s ease-in', style({opacity: 0}))
      ])
    ])
  ]
})
export class HostgroupComponent implements OnInit {
  public hostsDataSource: any = { title: '', label: 'Hosts', dataSource: '' };
  public servicesDataSource: any = { title: '', label: 'Servizi', dataSource: '' };

  padding: any = { left: 0, top: 0, right: 0, bottom: 0 };
  titlePadding: any = { left: 0, top: 0, right: 0, bottom: 5 };

  seriesGroups: any[] =
  [
    {
      type: 'pie',
      showLegend: true,
      enableSeriesToggle: true,
      series:
      [
        {
          dataField: 'Share',
          displayText: 'Title',
          showLabels: true,
          labelRadius: 160,
          labelLinesEnabled: true,
          labelLinesAngles: true,
          labelsAutoRotate: false,
          initialAngle: 0,
          radius: 125,
          minAngle: 0,
          maxAngle: 180,
          centerOffset: 0,
          offsetY: 170,
          formatFunction: (value: any, itemIdx: any, serieIndex: any, groupIndex: any) => {
              if (isNaN(value))
                  return value;
              return value + '%';
          }
        }
      ]
    }
  ];

  @ViewChild('ackForm') userForm: any;
  public ackModel: any = {};

  @ViewChild('f') form: any;
  model: any = {};
  loading = false;
  public token: string;
  public hostgroup: Hostgroup;
  public hosts: Host[];
  public services: Service[];
  public service_ack: ServiceAck;
  public host_logs: HostLog[];
  public service_logs: ServiceLog[];

  public host_chart = [];
  public service_chart = [];

  public hosts_down = 0;
  public hosts_unreachable = 0;
  public hosts_pending = 0;
  public hosts_up = 0;
  public hosts_count = 0;

  public services_crit = 0;
  public services_ok = 0;
  public services_ack = 0;
  public services_unknown = 0;
  public services_warn = 0;
  public services_count = 0;

  public viewMainTitle: string;
  public viewSecondaryTitle: string;
  public viewThirdTitle: string;

  public currentUser: User;

  public refreshedACK: Service;

  public services_change: ServiceChange[];

  page_host: number = 1;
  page_service: number = 1;
  page_service_log: number = 1;
  page_host_log: number = 1;
  page_service_change: number = 1;

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

  constructor(private route: ActivatedRoute, private alertService: AlertService, private hostgroupService: HostgroupService, public errorService: ErrorService) {
  	this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  	this.token = this.currentUser && this.currentUser.token;
  }

  public tservices_crit: number = 0;
  public tservices_ok: number = 0;
  public tservices_pending: number = 0;
  public tservices_unknown: number = 0;
  public tservices_warn: number = 0;
  public tservices_ack: number = 0;

  @ViewChild('btnACKClose') btnACKClose : ElementRef;
  @ViewChild('btnACKCloseEx') btnACKCloseEx : ElementRef;
  //@ViewChild('myHostChart') myHostChart: jqxChartComponent;
  @ViewChild('myServiceChart') myServiceChart: jqxChartComponent;
  @ViewChild('btnServiceModalOpen') btnServiceModalOpen : ElementRef;
  @ViewChild('btnHostModalOpen') btnHostModalOpen : ElementRef;


  //@ViewChild('ackColumn') ackColumn : ElementRef;

  /*public myHostChartWidth = undefined;
  public myHostChartHeight = undefined;*/

  public myServiceChartWidth = undefined;
  public myServiceChartHeight = undefined;
  public myMenuHeight = undefined;

  public first_time = false;

  public host_loading = false;
  public service_loading = false;

  public hosts_modal: Host[];
  public services_state: ServiceState[];

  public modalPanelTitle: string;
  public modalPanelState: number;

  public hostStates = [
    {
      stateId: 0,
      stateName: 'Online'
    },
    {
      stateId: 1,
      stateName: 'Offline'
    }
  ]

  public serviceStates = [
    {
      stateId: 0,
      stateName: 'OK'
    },
    {
      stateId: 1,
      stateName: 'Warning'
    },
    {
      stateId: 2,
      stateName: 'Critical'
    },
    {
      stateId: 4,
      stateName: 'ACK'
    },
    {
      stateId: 3,
      stateName: 'Unknown'
    },
  ]

  public fullyLoaded = false;
  public monitorHeight;

  ngOnInit() {
    this.monitorHeight = window.innerHeight;

    const id = this.route.snapshot.paramMap.get('id');
    const id2 = this.route.snapshot.paramMap.get('id2');


  	this.hostgroupService.getHostgroup(this.token, id).subscribe(hostgroup => {
      if(this.errorService.errorCode) {      
        //TO DO
      }
      else {
        this.hostgroup = hostgroup;

        this.hosts_down += this.hostgroup['hosts_down'];
        this.hosts_unreachable += this.hostgroup['hosts_unreachable'];
        this.hosts_pending += this.hostgroup['hosts_pending'];
        this.hosts_up += this.hostgroup['hosts_up'];

        this.services_crit += this.hostgroup['services_crit'];
        this.services_ok += this.hostgroup['services_ok'];
        this.services_ack += this.hostgroup['services_ack'];
        this.services_unknown += this.hostgroup['services_unknown'];
        this.services_warn += this.hostgroup['services_warn'];
      
        this.hosts_count = this.hosts_up + this.hosts_pending + this.hosts_unreachable + this.hosts_down;  
        this.services_count = this.services_ok + this.services_crit + this.services_warn + this.services_unknown + this.services_ack;   
        
        this.fullyLoaded = true;
        this.createGraphs();

        this.hostgroupService.getSiteServicesChange(id).subscribe(services_change => {
          this.services_change = services_change;
          if(!this.first_time) {
            /*this.myHostChartWidth = document.getElementById('hostGraph').offsetWidth - 18;;
            this.myHostChartHeight = 220;

            console.log("Height: " + this.myHostChartHeight);*/

            this.myServiceChartWidth = document.getElementById('serviceGraph').offsetWidth - 18;
            if(document.getElementById('notify') != null)
                this.myServiceChartHeight = document.getElementById('notify').offsetHeight - 40;

            if(document.getElementById('notify') != null) 
                this.myMenuHeight = document.getElementById('card_not').offsetHeight;
            //this.myServiceChartHeight = 220;
            this.first_time = true;
          }

          let totalHosts = this.hosts_up + this.hosts_down;
          let totalServices = this.services_ok + this.services_warn + this.services_crit + this.services_unknown + this.services_ack;

          let hostCounterArr = [];

          let hostsON = parseFloat(((this.hosts_up / totalHosts) * 100).toString()).toFixed(2);
          let hostsOFF = parseFloat(((this.hosts_down / totalHosts) * 100).toString()).toFixed(2);
          
          //if(hostsON !== '0.00')
            hostCounterArr.push({ Title: 'Online', Share: hostsON });
          if(hostsOFF !== '0.00')
            hostCounterArr.push({ Title: 'Offline', Share: hostsOFF });

          this.hostsDataSource = { title: '', label: 'Hosts', dataSource: hostCounterArr };

          let serviceCounterArr = [];

          let servicesOK = parseFloat(((this.services_ok / totalServices) * 100).toString()).toFixed(2);
          let servicesWARN = parseFloat(((this.services_warn / totalServices) * 100).toString()).toFixed(2);      
          let servicesCRIT = parseFloat(((this.services_crit / totalServices) * 100).toString()).toFixed(2);
          let servicesACK = parseFloat(((this.services_ack / totalServices) * 100).toString()).toFixed(2);
          let servicesUNK = parseFloat(((this.services_unknown / totalServices) * 100).toString()).toFixed(2);

          //if(servicesOK !== '0.00')
            serviceCounterArr.push({ Title: 'OK', Share: servicesOK });
          //if(servicesWARN !== '0.00')
            serviceCounterArr.push({ Title: 'Warning', Share: servicesWARN });
          //if(servicesCRIT !== '0.00')
            serviceCounterArr.push({ Title: 'Critical', Share: servicesCRIT });
          //if(servicesACK !== '0.00')
            serviceCounterArr.push({ Title: 'ACK', Share: servicesACK });
          if(servicesUNK !== '0.00')
            serviceCounterArr.push({ Title: 'UNK', Share: servicesUNK });
          
          this.servicesDataSource = { title: '', label: 'Servizi', dataSource: serviceCounterArr };      

          //this.myHostChart.update();
          this.myServiceChart.update();
        });

        for(let group of this.hostgroup.groups) {
          if(id2 == group['_id']) {
            this.getHosts(this.hostgroup, group, this.hostgroup['ip'], this.hostgroup['port'], id2);
          }
        }
      }
    });
  }

  createGraphs() {
    setTimeout(() => {
      /*this.myHostChart.addColorScheme('hostColorScheme',['#1e993b', '#f05050', '#0e71b4']);
      this.myHostChart.colorScheme('hostColorScheme');*/

      this.myServiceChart.addColorScheme('serviceColorScheme',['#1e993b', '#ff902b', '#f05050', '#0e71b4', '#757575']);
      this.myServiceChart.colorScheme('serviceColorScheme');
    }, 100);
  }

  ngAfterViewInit()
  {

  }

  public clickHostsGraph(event: any) {
    if('args' in event) {
      if('elementIndex' in event.args) {
        this.btnHostModalOpen.nativeElement.click();
        this.getHostsByState(this.hostStates[event.args.elementIndex].stateId, this.hostStates[event.args.elementIndex].stateName);       
      }
    }
  } 

  public clickServicesGraph(event: any) {
    if('args' in event) {
      if('elementIndex' in event.args) {
        this.btnServiceModalOpen.nativeElement.click();
        this.getServicesByState(this.serviceStates[event.args.elementIndex].stateId, this.serviceStates[event.args.elementIndex].stateName);
      }
    }
  }

  public getHostsByState(state: number, title: string) {
    this.host_loading = true;
    this.modalPanelTitle = title;
    this.modalPanelState = state;    
    this.hosts_modal = undefined;
    this.hostgroupService.getCustomerSiteHostsByState(this.route.snapshot.paramMap.get('id'), state).subscribe(hosts_modal => {
      this.hosts_modal = hosts_modal;  
      this.host_loading = false; 
    });    
  }

  public getServicesByState(state: number, title: string) {

    this.service_loading = true;
    this.modalPanelState = state;
    this.modalPanelTitle = title;
    this.services_state = undefined;
    this.hostgroupService.getCustomerSiteServicesByState(this.route.snapshot.paramMap.get('id'), state).subscribe(services_state => {
      this.services_state = services_state;  
      this.service_loading = false; 
    });    
  }

  public getHosts(hostgroup: Hostgroup, groupID: any, ip:string, port: number, id: string) {
    this.hostgroupService.getHosts(ip, port, id).subscribe(hosts => {
      this.hosts = hosts;
      this.viewMainTitle = groupID.alias;
    });
  }

  public getHostsACKCount(hostgroup: Hostgroup, groupID: any, ip:string, port: number, id: string) {
    let local_crit = 0;
    let local_ok = 0;
    let local_pending = 0;
    let local_unknown = 0;
    let local_warn = 0;

    this.hostgroupService.getHosts(ip, port, id).subscribe(hosts => {
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

  public getHostLogs(host: Host) {
    this.hostgroupService.getHostLogs(host._id).subscribe(host_logs => {
      this.host_logs = host_logs;      
    });
    this.viewSecondaryTitle = host.alias;
  }

  public getServiceLogs(service: Service) {
    this.page_service_log = 1;
    this.hostgroupService.getServiceLogs(service._id).subscribe(service_logs => {
      this.service_logs = service_logs;      
    });
    this.viewThirdTitle = service.name;
  }

  public deleteACK(service_id: string, ack_id: string) {
    this.hostgroupService.deleteServiceAck(service_id, ack_id).subscribe(response => {
      if(response) {
        for (const prop of Object.keys(this.refreshedACK.ack)) {
          delete this.refreshedACK.ack[prop];         
        }
        this.btnACKClose.nativeElement.click();

        const id = this.route.snapshot.paramMap.get('id');
        const id2 = this.route.snapshot.paramMap.get('id2');
    
    
        this.hostgroupService.getHostgroup(this.token, id).subscribe(hostgroup => {
          this.hostgroup = hostgroup;
    
    
          this.hosts_down = this.hostgroup['hosts_down'];
          this.hosts_unreachable = this.hostgroup['hosts_unreachable'];
          this.hosts_pending = this.hostgroup['hosts_pending'];
          this.hosts_up = this.hostgroup['hosts_up'];
    
          this.services_crit = this.hostgroup['services_crit'];
          this.services_ok = this.hostgroup['services_ok'];
          this.services_ack = this.hostgroup['services_ack'];
          this.services_unknown = this.hostgroup['services_unknown'];
          this.services_warn = this.hostgroup['services_warn'];

          this.tservices_crit = 0;
          this.tservices_ok = 0;
          this.tservices_ack = 0;
          this.tservices_unknown = 0;
          this.tservices_warn = 0;
          this.tservices_ack = 0;

          for(let group of this.hostgroup.groups) {
            if(id2 == group['_id']) {
              this.getHosts(this.hostgroup, group, this.hostgroup['ip'], this.hostgroup['port'], id2);
            }
          }     
    
          this.hosts_count = this.hosts_up + this.hosts_pending + this.hosts_unreachable + this.hosts_down;
          this.services_count = this.services_ok + this.services_ack + this.services_warn + this.services_unknown + this.services_crit;
        });
      }
    });
  }

  public refreshACK(ack: Service) {
    this.refreshedACK = ack;

    this.ackModel.code = this.refreshedACK.ack.code;
    this.ackModel.message = this.refreshedACK.ack.message;
  }

  public refreshedACKEx: string;
  public refreshedService: string;

  public refreshACKEx(ack: string, service: string) {
    this.refreshedACKEx = ack;
    this.refreshedService = service;
  }

  public deleteACKEx(ack_id: string, service_id: string) {
    this.hostgroupService.deleteServiceAck(service_id, ack_id).subscribe(response => {
      if(response) {
        this.btnACKCloseEx.nativeElement.click();
        this.getServicesByState(4, 'ACK');

        const id = this.route.snapshot.paramMap.get('id');
        const id2 = this.route.snapshot.paramMap.get('id2');
    
    
        this.hostgroupService.getHostgroup(this.token, id).subscribe(hostgroup => {
          this.hostgroup = hostgroup;
    
    
          this.hosts_down = this.hostgroup['hosts_down'];
          this.hosts_unreachable = this.hostgroup['hosts_unreachable'];
          this.hosts_pending = this.hostgroup['hosts_pending'];
          this.hosts_up = this.hostgroup['hosts_up'];
    
          this.services_crit = this.hostgroup['services_crit'];
          this.services_ok = this.hostgroup['services_ok'];
          this.services_ack = this.hostgroup['services_ack'];
          this.services_unknown = this.hostgroup['services_unknown'];
          this.services_warn = this.hostgroup['services_warn'];

          this.tservices_crit = 0;
          this.tservices_ok = 0;
          this.tservices_ack = 0;
          this.tservices_unknown = 0;
          this.tservices_warn = 0;
          this.tservices_ack = 0;

          for(let group of this.hostgroup.groups) {
            if(id2 == group['_id']) {
              this.getHosts(this.hostgroup, group, this.hostgroup['ip'], this.hostgroup['port'], id2);
            }
          }     
    
          this.hosts_count = this.hosts_up + this.hosts_pending + this.hosts_unreachable + this.hosts_down;
          this.services_count = this.services_ok + this.services_ack + this.services_warn + this.services_unknown + this.services_crit;
        });
      }
    });
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

    if(this.model.code == null)
      this.model.code = undefined;

    if(this.model.message == null)
      this.model.message = undefined;

    this.hostgroupService.createACK(ack.host_id, ack._id, user_id, this.route.snapshot.paramMap.get('id'), this.model.message, final, this.model.code).subscribe(response => {
      if(response.status == 201) {
        this.alertService.success('ACK modificato con successo.');
        this.loading = false;

        this.ackModel.code = this.model.code;
        this.ackModel.message = this.model.message;

        this.model.message = '';
        this.model.code = '';

        this.refreshedACK.ack = response.body.message;

        const id = this.route.snapshot.paramMap.get('id');
        const id2 = this.route.snapshot.paramMap.get('id2');
    
    
        this.hostgroupService.getHostgroup(this.token, id).subscribe(hostgroup => {
          this.hostgroup = hostgroup;
    
    
          this.hosts_down = this.hostgroup['hosts_down'];
          this.hosts_unreachable = this.hostgroup['hosts_unreachable'];
          this.hosts_pending = this.hostgroup['hosts_pending'];
          this.hosts_up = this.hostgroup['hosts_up'];
    
          this.services_crit = this.hostgroup['services_crit'];
          this.services_ok = this.hostgroup['services_ok'];
          this.services_ack = this.hostgroup['services_ack'];
          this.services_unknown = this.hostgroup['services_unknown'];
          this.services_warn = this.hostgroup['services_warn'];

          this.tservices_crit = 0;
          this.tservices_ok = 0;
          this.tservices_ack = 0;
          this.tservices_unknown = 0;
          this.tservices_warn = 0;
          this.tservices_ack = 0;
    
          for(let group of this.hostgroup.groups) {
            if(id2 == group['_id']) {
              this.getHosts(this.hostgroup, group, this.hostgroup['ip'], this.hostgroup['port'], id2);
            }
          }            
        
          this.hosts_count = this.hosts_up + this.hosts_pending + this.hosts_unreachable + this.hosts_down;
          this.services_count = this.services_ok + this.services_ack + this.services_warn + this.services_unknown + this.services_crit;
        });       
      }
      else {
        this.alertService.error(response.body.message);
        this.loading = false;
      }
    });       
  }

  public getServices(host_id: string, alias: string) {
    this.hostgroupService.getServices(host_id).subscribe(services => {
      this.page_service = 1;
      this.services = services;
    });
    this.viewSecondaryTitle = alias;
  }

  public resetServicePage() {
    this.page_service = 1;    
  }

  public resetHostPage() {
    this.page_host = 1;    
  }

  public updateACK(form: NgForm, ack: ServiceAck) {

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
    this.loading = true;

    this.hostgroupService.updateACK(ack._id, ack.service_id, this.model.message, this.model.code, this.currentUser['id'], final).subscribe(response => {
      if(response.status == 200) {
        this.refreshedACK.ack = response.body.message;

        this.alertService.success('ACK modificato con successo.');
        this.loading = false;          
      }
      else {
        this.alertService.error(response.body.message);
        this.loading = false;
      }
    }); 
  }

  public updateNotification(user_customer_site_id: string, notification: number) {
    let val = (notification) ? 0 : 1;

    this.hostgroupService.updateUserCustomerSite(user_customer_site_id, val, val).subscribe(response => {
      if(response.status == 200) {
        this.hostgroup.notification = val;
      }
    });   
  }
}

