import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { Infrastructure } from '../infrastructure';
import { InfrastructureService } from '../infrastructure.service';

@Component({
  selector: 'app-infrastructures',
  templateUrl: './infrastructures.component.html',
  styleUrls: ['./infrastructures.component.css'],
  animations: [
    trigger('infrastructureState', [
      state('inactive', style({ height: '0px', visibility: 'hidden' })),
      state('active',   style({ height: '100%', visibility: 'visible' })),
      transition('inactive => active', animate('500ms ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ])      
  ]
})
export class InfrastructuresComponent implements OnInit {

	infrastructures: Infrastructure[];

  constructor(private infrastructureService: InfrastructureService) { }

  ngOnInit() {
  	this.getInfrastructures();
  }

  getInfrastructures(): void {
  	this.infrastructureService.getInfrastructures().subscribe(infrastructures => this.infrastructures = infrastructures);
	}

  foo(): void {
    for (let infrastructure of this.infrastructures) {
      infrastructure.toggleState(); // 1, "string", false
    }
  }

}
