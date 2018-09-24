import { Component, OnInit } from '@angular/core';
import { HostgroupService } from '../_services/index';
import { User, Hostgroup, Host, Service, ServiceState, ServiceChange, ServiceAck } from '../_models/index';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { colorSets as ngxChartsColorsets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: []
})

export class HomeComponent implements OnInit {

	public token: string;
  public hostgroups: Hostgroup[];
  public hosts: Host[];
  public services_state: ServiceState[];
  public services_change: ServiceChange[];
  public acks: ServiceAck[];

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

  public page_host: number = 1;
  public page_service: number = 1;
  public page_service_change: number = 1;
  public currentUser: User;

  public host_loading = false;
  public service_loading = false;
  public num_loading = false;

  public refreshPanelTimer;

  /********************************************************************
   * Host Graph
   * 
   *******************************************************************/

  public hostChartData: any[];
  public hostChartScheme = {
    domain: ['#27c24c', '#f05050', '#0e71b4']
  };

  /********************************************************************
   * Service Graph
   * 
   *******************************************************************/

  public serviceChartData: any[];
  public serviceChartScheme = {
    domain: ['#27c24c', '#ff902b', '#f05050', '#0e71b4']
  };


  /********************************************************************
   * Methods
   * 
   *******************************************************************/

  public onSelectHostChart(event) {
    if(event.name == 'Online') {
      this.getHostsByState(0, 'Online');
    }
    else if(event.name == 'Offline') {
      this.getHostsByState(1, 'Offline');
    }
  }

  public onSelectServiceChart(event) {
    if(event.name == 'OK') {
      this.getServicesByState(0, 'OK');
    }
    else if(event.name == 'Warning') {
      this.getServicesByState(1, 'Warning');
    }
    else if(event.name == 'Critical') {
      this.getServicesByState(2, 'Critical');
    }
    else if(event.name == 'Unknown') {
      this.getServicesByState(3, 'Unknown');
    }
  }

  constructor(private hostgroupService: HostgroupService) {
  	this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  	this.token = this.currentUser && this.currentUser.token;
  }

  ngOnInit() {    

    this.hosts_down = 0;
    this.hosts_unreachable = 0;
    this.hosts_pending = 0;
    this.hosts_up = 0;
    this.hosts_count = 0;
  
    this.services_crit = 0;
    this.services_ok = 0;
    this.services_pending = 0;
    this.services_unknown = 0;
    this.services_warn = 0;
    this.services_count = 0;

    //this.services_change = undefined;
    this.num_loading = true;

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
      this.hosts_count = this.hosts_up + this.hosts_pending + this.hosts_unreachable + this.hosts_down;  
      this.services_count = this.services_ok + this.services_crit + this.services_warn + this.services_unknown;   
      
      this.hostChartData = [
        {
          "name": "Online",
          "value": this.hosts_up
        },
        {
          "name": "Offline",
          "value": this.hosts_down
        },
        {
          "name": "Manteinance",
          "value": this.hosts_pending
        }
      ]

      this.serviceChartData = [
        {
          "name": "OK",
          "value": this.services_ok
        },
        {
          "name": "Warning",
          "value": this.services_warn
        },
        {
          "name": "Critical",
          "value": this.services_crit
        },
        {
          "name": "Unknown",
          "value": this.services_unknown
        }
      ]
    });   
    this.getServicesChange();

    this.refreshPanelTimer = setInterval( () => {           
      this.hosts_down = 0;
      this.hosts_unreachable = 0;
      this.hosts_pending = 0;
      this.hosts_up = 0;
      this.hosts_count = 0;
    
      this.services_crit = 0;
      this.services_ok = 0;
      this.services_pending = 0;
      this.services_unknown = 0;
      this.services_warn = 0;
      this.services_count = 0;

      //this.services_change = undefined;
      this.num_loading = true;      

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
        this.hosts_count = this.hosts_up + this.hosts_pending + this.hosts_unreachable + this.hosts_down;  
        this.services_count = this.services_ok + this.services_crit + this.services_warn + this.services_unknown;       
      });
      this.getServicesChange();      
    }, 30000);
   
  }

  ngOnDestroy() {
    if (this.refreshPanelTimer) {
      clearInterval(this.refreshPanelTimer);
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
    this.hostgroupService.getServicesChange().subscribe(services_change => {
      this.services_change = services_change;    
      this.num_loading = false;    
    });    
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
