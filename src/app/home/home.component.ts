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

  constructor(private infrastructureService: InfrastructureService) {
  	var currentUser = JSON.parse(localStorage.getItem('currentUser'));
  	this.token = currentUser && currentUser.token;
  }

  ngOnInit() {
  	this.infrastructureService.getInfrastructures(this.token).subscribe(infrastructures => this.infrastructures = infrastructures);
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
