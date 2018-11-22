import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

  
  @ViewChild('f') form: any;
  model: any = {};


  login_loading = false;
  recover_loading = false;
  error = '';
  returnUrl: string;

  public alertType: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(form: NgForm) {
    this.login_loading = true;
    let remember = (this.model.remember == true) ? 1 : 0;

    this.authenticationService.login(this.model.username, this.model.password, remember).subscribe(response => {
      if (response == true) {
        setTimeout((router: Router) => {
            this.router.navigate([this.returnUrl]);
        }, 1500);        
      }
      else {
        this.alertType = 0;
        this.alertService.error('Username o password errati');
        this.login_loading = false;
      }
    });
  }

  public forgotPassword(form: NgForm) {
    console.log(this.model);
    this.recover_loading = true;
    this.authenticationService.recoverPassword(this.model.email).subscribe(response => {
      if(response) {
        this.recover_loading = false;
      }
      else {
        this.alertType = 1;
        this.alertService.error('Indirizzo E-Mail inesistente');
        this.recover_loading = false;
      }
    });
  }
}
