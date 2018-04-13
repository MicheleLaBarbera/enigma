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
import { Infrastructure, Service } from '../_models/index';

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
    ])
  ]
})
export class HomeComponent implements OnInit {
	//currentUser: User;
	public token: string;
  infrastructures: Infrastructure[];
  services: Service[];

  constructor(private infrastructureService: InfrastructureService) {
  	var currentUser = JSON.parse(localStorage.getItem('currentUser'));
  	this.token = currentUser && currentUser.token;
  }

  ngOnInit() {
  	this.infrastructureService.getInfrastructures(this.token).subscribe(infrastructures => this.infrastructures = infrastructures);
  }

  getServices(ip:string, port: number, group: string) {
    this.infrastructureService.getServices(ip, port, group).subscribe(services => this.services = services);
  }

}
