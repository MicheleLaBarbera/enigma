import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AlertService, AuthenticationService, HostgroupService } from '../_services/index';

import { Customer } from '../_models/index';

@Component({
  selector: 'app-acp',
  templateUrl: './acp.component.html',
  styleUrls: ['./acp.component.css']
})
export class AcpComponent implements OnInit {
  public token: string;
  @ViewChild('f') form: any;
  model: any = {};
  loading = false;
  viewPanel = 0;
  viewTitle = "Amministrazione Utenti - Aggiungi Utente";
  public customers: Customer[];

  constructor(private authenticationService: AuthenticationService, private alertService: AlertService, private hostgroupService: HostgroupService) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  ngOnInit() {
    this.hostgroupService.getCustomers().subscribe(response => {
      this.customers = response;
      console.log(response);
    });
  }

  signup(form: NgForm) {
    this.loading = true;
    this.authenticationService.signup(this.model.firstname, this.model.lastname, this.model.username, this.model.password, this.model.customer).subscribe(response => {
      if (response.status == 201) {
        this.alertService.success('Utente registrato con successo.');
        this.loading = false;
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

  changeView(value: number, title: string) {
    this.viewPanel = value;
    this.viewTitle = title;
  }
}
