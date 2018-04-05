import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { InfrastructureService } from '../_services/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	//currentUser: User;
	public token: string;

  constructor(private infrastructureService: InfrastructureService,) {
  	var currentUser = JSON.parse(localStorage.getItem('currentUser'));
  	this.token = currentUser && currentUser.token;
  }

  ngOnInit() {
  	console.log("a");
  	this.infrastructureService.getInfrastructures(this.token).subscribe(result => {
      if (result === true) {
        //this.router.navigate([this.returnUrl]);
        console.log("SUCCESS");
      } 
      else {
        //this.alertService.error('Username o password errati');
        //this.loading = false;
        console.log("ERROR");
      }
    });
  }

}
