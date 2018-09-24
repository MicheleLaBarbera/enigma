import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  moduleId: module.id
})

export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  error = '';
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    let remember = (this.model.remember == true) ? 1 : 0;

    this.authenticationService.login(this.model.username, this.model.password, remember).subscribe(response => {
      if (response == true) {
        setTimeout((router: Router) => {
            this.router.navigate([this.returnUrl]);
        }, 1500);        
      }
      else {
        this.alertService.error('Username o password errati');
        this.loading = false;
      }
    });
  }
}
