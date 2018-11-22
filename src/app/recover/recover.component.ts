import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService, AlertService, HostgroupService } from '../_services/index';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})

export class RecoverComponent implements OnInit {

	public returnUrl: string;
	public validRecover: number;

  public tokenUrl;

  public loading = false;

  @ViewChild('passwordForm') passwordForm: any;
  public passwordModel: any = {};

  constructor(
  	private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private hostgroupService: HostgroupService,
    private alertService: AlertService) { }

  ngOnInit() {
  	this.validRecover = 0;
    this.tokenUrl = this.route.snapshot.paramMap.get('token');

  	this.authenticationService.checkRecoverToken(this.tokenUrl).subscribe(response => {
      if (response == true) {
      	this.validRecover = 1;
      }
      else {
      	this.router.navigate(['/login']);
      }
    });
  }

  changePassword(form: NgForm) {
    this.loading = true;
    this.hostgroupService.updatePassword(this.tokenUrl, this.passwordModel.password, this.passwordModel.confirm_password).subscribe(response => {
      if(response == true) {
        this.passwordModel.password = '';
        this.passwordModel.confirm_password = '';

        this.alertService.success('Password modificata con successo.');
        this.loading = false;      

        setTimeout((router: Router) => {
            this.router.navigate(['/login']);
        }, 1500);                
      }
      else {
        this.alertService.error('Impossibile modificare la password.');
        this.loading = false;

        setTimeout((router: Router) => {
            this.router.navigate(['/login']);
        }, 1500);        
      }
    });    
  }

}
