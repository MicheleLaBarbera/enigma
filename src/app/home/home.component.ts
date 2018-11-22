import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertService, HostgroupService } from '../_services/index';
import { User, Hostgroup, Host, Service, ServiceState, ServiceChange, ServiceAck, ServiceLog } from '../_models/index';
import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { jqxChartComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxchart';
import { trigger, transition, animate, style } from '@angular/animations'
import { NgForm } from '@angular/forms';
import { ErrorService }  from '../error.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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

export class HomeComponent implements OnInit {

  public hostsDataSource: any = { title: '', label: 'Hosts', dataSource: '' };
  public servicesDataSource: any = { title: '', label: 'Servizi', dataSource: '' };

  public padding: any = { left: 0, top: 0, right: 0, bottom: 0 };
  public titlePadding: any = { left: 0, top: 0, right: 0, bottom: 5 };

  public seriesGroups: any[] =
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

	public token: string;
  public hostgroups: Hostgroup[];
  public custom_hostgroups = new Array();;
  public hosts: Host[];
  public services_state: ServiceState[];
  public services_change: ServiceChange[];
  public acks: ServiceAck[];
  public services: Service[];

  public hosts_down = 0;
  public hosts_unreachable = 0;
  public hosts_pending = 0;
  public hosts_up = 0;
  public hosts_count = 0;

  public services_crit = 0;
  public services_ok = 0;
  public services_unknown = 0;
  public services_warn = 0;
  public services_count = 0;
  public services_ack = 0;

  public modalPanelTitle: string;
  public modalPanelState: number;

  public page_host: number = 1;
  public page_service: number = 1;
  public page_service_change: number = 1;
  public page_service_ex: number = 1;
  public page_service_log: number = 1;

  public currentUser: User;

  public host_loading = false;
  public service_loading = false;
  public num_loading = false;

  public refreshPanelTimer;

  public refreshedACK: string;
  public refreshedService: string;

  public myHostChartWidth = undefined;
  public myHostChartHeight = undefined;

  public myServiceChartWidth = undefined;
  public myServiceChartHeight = undefined;

  public first_time = false;

  public userCustomRows = 2;
  public userCustomPages = 0;
  public userCurrentPage = 0;

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

  public viewSecondaryTitle: string;
  public viewThirdTitle: string;

  public refreshedACKModal: Service;

  public service_logs: ServiceLog[];

  public fullyLoaded = false;
  public monitorHeight;

  @ViewChild('f') form: any;
  model: any = {};
  loading = false;

  @ViewChild('btnServiceModalOpen') btnServiceModalOpen : ElementRef;
  @ViewChild('btnHostModalOpen') btnHostModalOpen : ElementRef;
  @ViewChild('myHostChart') myHostChart: jqxChartComponent;
  @ViewChild('myServiceChart') myServiceChart: jqxChartComponent;
  @ViewChild('btnACKClose') btnACKClose : ElementRef;
  @ViewChild('btnACKCloseEx') btnACKCloseEx : ElementRef;

  constructor(private hostgroupService: HostgroupService, 
              private alertService: AlertService, 
              public errorService: ErrorService, 
              private route: ActivatedRoute,
              private router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = this.currentUser && this.currentUser.token;
  }

  ngOnInit() {    
    this.errorService.errorCode = undefined;


    this.monitorHeight = window.innerHeight;
    
    this.resetHostgroupsStats();
    this.num_loading = true;
    this.fullyLoaded = false;

    this.hostgroupService.getHostgroups(this.token).subscribe(hostgroups => {
      if(this.errorService.errorCode) {        
        //TODO
        this.fullyLoaded = true;
      }
      else {
        this.hostgroups = hostgroups;
        if(this.hostgroups.length == 1) {
          for(let hostgroup of this.hostgroups) {
            for(let group of hostgroup.groups) {
              this.router.navigate(['/site/' + hostgroup._id + '/hostgroup/' + group["_id"]]);              
              break;
            }            
          }
        }
        else {
          this.calculateHostgroupsStats();     
          this.getServicesChange();

          this.userCurrentPage = 1;
          this.changeHostgroups();
          this.fullyLoaded = true;
          this.createGraphs();
        }
      }
    });   
    

    this.refreshPanelTimer = setInterval( () => {           
      this.resetHostgroupsStats();
      this.num_loading = true;      

      this.hostgroupService.getHostgroups(this.token).subscribe(hostgroups => {
        this.hostgroups = hostgroups;  
        this.calculateHostgroupsStats();
        this.getServicesChange(); 

        this.changeHostgroups();  
      });
           
    }, 60000);   
  }

  createGraphs() {
    setTimeout(() => {
      this.myHostChart.addColorScheme('hostColorScheme',['#1e993b', '#f05050', '#0e71b4']);
      this.myHostChart.colorScheme('hostColorScheme');   

      this.myServiceChart.addColorScheme('serviceColorScheme',['#1e993b', '#ff902b', '#f05050', '#0e71b4', '#757575']);
      this.myServiceChart.colorScheme('serviceColorScheme');
    }, 100);
  }

  ngAfterViewInit()
  {    

  }

  ngOnDestroy() {
    if (this.refreshPanelTimer) {
      clearInterval(this.refreshPanelTimer);
    }
  }

  public resetHostgroupsStats() {
    this.hosts_down = this.hosts_unreachable = this.hosts_pending = this.hosts_up = this.hosts_count = 0;      
    this.services_crit = this.services_ok = this.services_ack = this.services_unknown = this.services_warn = this.services_count = 0;
  }

  public calculateHostgroupsStats() {
    for(let hostgroup of this.hostgroups) {
        this.hosts_down += hostgroup['hosts_down'];
        this.hosts_unreachable += hostgroup['hosts_unreachable'];
        this.hosts_pending += hostgroup['hosts_pending'];
        this.hosts_up += hostgroup['hosts_up'];

        this.services_crit += hostgroup['services_crit'];
        this.services_ok += hostgroup['services_ok'];

        this.services_unknown += hostgroup['services_unknown'];
        this.services_warn += hostgroup['services_warn'];
        this.services_ack += hostgroup['services_ack'];
    }
    this.hosts_count = this.hosts_up + this.hosts_pending + this.hosts_unreachable + this.hosts_down;  
    this.services_count = this.services_ok + this.services_crit + this.services_warn + this.services_unknown + this.services_ack;  
    console.log("Calc:" + this.services_count)   
  }

  public changeHostgroups() {
    if(window.innerWidth < 576)
      this.userCustomRows = 20;

    this.custom_hostgroups = [];
    let items = this.userCustomRows * 4;
    let x = (this.hostgroups.length % 8) ? 1 : 0;

    //console.log(this.hostgroups.length + " - " + items + " - " + x);
    let pages = this.hostgroups.length / items + x;
    let userCustomPagesString = pages.toString();
    this.userCustomPages = parseInt(userCustomPagesString);
    
    let idx = (this.userCurrentPage - 1) * items;
    let max = (this.hostgroups.length - idx > items) ? idx + items : this.hostgroups.length;

    let i = 0;
    this.hostgroups.forEach(element => {
      if(i >= idx) {
        if(idx < max) {
          this.custom_hostgroups.push(element);
          idx++;
        }
      }
      i++;
    });
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
    this.hosts = undefined;
    this.hostgroupService.getHostsByState(state).subscribe(hosts => {
      this.hosts = hosts;  
      this.host_loading = false; 
    });    
  }

  public getServicesByState(state: number, title: string) {

    this.service_loading = true;
    this.modalPanelState = state;
    this.modalPanelTitle = title;
    this.services_state = undefined;
    this.hostgroupService.getServicesByState(state).subscribe(services_state => {
      this.services_state = services_state;  
      this.service_loading = false; 
    });    
  }

  public getACKS() {
    this.service_loading = true;
    this.modalPanelTitle = 'ACKS';
    this.acks = undefined;
    this.hostgroupService.getACKS().subscribe(acks => {
      this.acks = acks;  
      this.service_loading = false; 
    });    
  }

  public getServicesChange() {    
    this.hostgroupService.getServicesChange(this.currentUser['id']).subscribe(services_change => {
      this.services_change = services_change;    
      this.num_loading = false;    

      if(window.innerWidth < 576) {
        if(!this.first_time) {
          this.myHostChartWidth = document.getElementById('hostGraph').offsetWidth - 18;
          this.myHostChartHeight = 220;

          this.myServiceChartWidth = document.getElementById('hostGraph').offsetWidth - 18;
          this.myServiceChartHeight = 220;
          this.first_time = true;
        }
      }
      else {
        if(!this.first_time) {
          this.myHostChartWidth = document.getElementById('hostGraph').offsetWidth - 18;
          if(document.getElementById('notify') != null)
            this.myHostChartHeight = document.getElementById('notify').offsetHeight - 40;

          this.myServiceChartWidth = document.getElementById('hostGraph').offsetWidth - 18;
          if(document.getElementById('notify') != null)
            this.myServiceChartHeight = document.getElementById('notify').offsetHeight - 40;
          this.first_time = true;
        }
      }

      let totalHosts = this.hosts_up + this.hosts_down;
      let totalServices = this.services_ok + this.services_warn + this.services_crit + this.services_unknown + this.services_ack;
      console.log(totalServices)
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
      
      console.log(serviceCounterArr);
      this.servicesDataSource = { title: '', label: 'Servizi', dataSource: serviceCounterArr };      

      this.myHostChart.update();
      this.myServiceChart.update();
    });    
  }

  public refreshACK(ack: string, service: string) {
    this.refreshedACK = ack;
    this.refreshedService = service;
  }

  public deleteACK(ack_id: string, service_id: string) {
    this.hostgroupService.deleteServiceAck(service_id, ack_id).subscribe(response => {
      if(response) {
        this.btnACKClose.nativeElement.click();
        this.getServicesByState(4, 'ACK');

        this.resetHostgroupsStats();

        this.num_loading = true;      

        this.hostgroupService.getHostgroups(this.token).subscribe(hostgroups => {
          this.hostgroups = hostgroups;    
          this.calculateHostgroupsStats();
          this.getServicesChange();

          this.changeHostgroups();  
        });
        
      }
    });
  }

  public previousPage() {    
    this.userCurrentPage = (this.userCurrentPage - 1 != 0) ? this.userCurrentPage - 1 : this.userCustomPages;
    this.changeHostgroups();
  }

  public nextPage() {    
    this.userCurrentPage = (this.userCurrentPage + 1 <= this.userCustomPages) ? this.userCurrentPage + 1 : 1;
    this.changeHostgroups();
  }

  public resetServicePage() {
    this.page_service = 1;    
  }

  public resetHostPage() {
    this.page_host = 1;    
  }

  public getServices(host_id: string, alias: string) {        
    this.hostgroupService.getServices(host_id).subscribe(services => {
      this.page_service_ex = 1;
      this.services = services;
    });
    this.viewSecondaryTitle = alias;
  }

  public refreshACKModal(ack: Service) {
    this.refreshedACKModal = ack;
  }

  public createACKModal(ack: Service, user_id: string, form: NgForm) {    
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

    this.hostgroupService.createACK(ack.host_id, ack._id, user_id, ack.host_group_id, this.model.message, final, this.model.code).subscribe(response => {
      if(response.status == 201) {
        this.alertService.success('ACK modificato con successo.');
        this.loading = false;

        this.refreshedACKModal.ack = response.body.message;

        this.hostgroupService.getHostgroups(this.token).subscribe(hostgroups => {
          this.hostgroups = hostgroups;    
          this.calculateHostgroupsStats();
          this.getServicesChange();

          this.changeHostgroups();  
        });
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

  public deleteACKEx(service_id: string, ack_id: string) {
    this.hostgroupService.deleteServiceAck(service_id, ack_id).subscribe(response => {
      if(response) {
        for (const prop of Object.keys(this.refreshedACKModal.ack)) {
          delete this.refreshedACKModal.ack[prop];         
        }
        this.btnACKClose.nativeElement.click();

        this.resetHostgroupsStats();

        this.num_loading = true;      

        this.hostgroupService.getHostgroups(this.token).subscribe(hostgroups => {
          this.hostgroups = hostgroups;    
          this.calculateHostgroupsStats();
          this.getServicesChange();

          this.changeHostgroups();  
        });
      }
    });
  }

  public getServiceLogs(service: Service) {
    this.hostgroupService.getServiceLogs(service._id).subscribe(service_logs => {
      this.page_service_log = 1;
      this.service_logs = service_logs;      
    });
    this.viewThirdTitle = service.name;
  }
}