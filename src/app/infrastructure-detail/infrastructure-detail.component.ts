import { Component, OnInit, Input } from '@angular/core';
import { Infrastructure } from '../infrastructure';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { InfrastructureService }  from '../infrastructure.service';

@Component({
  selector: 'app-infrastructure-detail',
  templateUrl: './infrastructure-detail.component.html',
  styleUrls: ['./infrastructure-detail.component.css']
})
export class InfrastructureDetailComponent implements OnInit {

	@Input() infrastructure: Infrastructure;

  private hostgroup;

  constructor(
	  private route: ActivatedRoute,
	  private infrastructureService: InfrastructureService,
	  private location: Location
	) {}

  ngOnInit() {
  	this.getInfrastructure();
  }

  getInfrastructure(): void {
  	const ip = +this.route.snapshot.paramMap.get('ip');
    const port = +this.route.snapshot.paramMap.get('port');
  	this.infrastructureService.getInfrastructure(ip, port).subscribe(result => this.hostgroup = result);
  }

  goBack(): void {
  	this.location.back();
	}

}
