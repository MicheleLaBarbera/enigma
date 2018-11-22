import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { User } from '../_models/index';

import { AlertService, HostgroupService } from '../_services/index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	public token: string;
	public currentUser: User;

	@ViewChild('userForm') userForm: any;
  public userModel: any = {};

  @ViewChild('passwordForm') passwordForm: any;
  public passwordModel: any = {};

  public loading = false;

  public viewPanel: number;
  public viewTitle: string;

  constructor(private alertService: AlertService, private hostgroupService: HostgroupService) {
  	this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = this.currentUser && this.currentUser.token;     
  }

  ngOnInit() {
    this.changeView(1, "Modifica Informazioni");
  }

  changeView(value: number, title: string) {
    switch(value) {
      case 1: {
        this.userModel.firstname = this.currentUser.firstname;
        this.userModel.lastname = this.currentUser.lastname;
        this.userModel.email = this.currentUser.email;
        this.userModel.telegram_id = this.currentUser.telegram_id;
        this.userModel.phone_number = this.currentUser.phone_number;
        this.userModel.office_number = this.currentUser.office_number;

        this.alertService.resetMessage();
        break;
      }  
      case 2: {
        this.userModel.current_password = '';
        this.userModel.new_password = '';
        this.userModel.confirm_password = '';

        this.alertService.resetMessage();
      }    
    }
    this.viewPanel = value;
    this.viewTitle = title;
  }

  updateUser(form: NgForm, user_id: string) {
    this.loading = true;
    this.hostgroupService.updateUserProfile(user_id, this.userModel.firstname, this.userModel.lastname, this.userModel.email, 
                                    this.userModel.telegram_id, this.userModel.phone_number, this.userModel.office_number).subscribe(response => {
      if(response.status == 200) {
        this.currentUser.firstname = this.userModel.firstname;
        this.currentUser.lastname = this.userModel.lastname;
        this.currentUser.email = this.userModel.email;
        this.currentUser.telegram_id = this.userModel.telegram_id;
        this.currentUser.phone_number = this.userModel.phone_number;
        this.currentUser.office_number = this.userModel.office_number;
        this.currentUser.token = response.body.token;

        localStorage.setItem('currentUser', JSON.stringify({ id: user_id, username: this.currentUser.username, firstname: this.currentUser.firstname, 
                                                            lastname: this.currentUser.lastname, role: this.currentUser.role, 
                                                            email: this.currentUser.email, token: this.currentUser.token, logo: this.currentUser.logo, 
                                                            customer_name: this.currentUser.customer_name, telegram_id: this.currentUser.telegram_id, 
                                                            phone_number: this.currentUser.phone_number, office_number: this.currentUser.office_number }));

        this.alertService.success('Profilo modificato con successo.');
        this.loading = false;                  
      }
      else {

        this.alertService.error(response.body.message);
        this.loading = false;
      }
    });    
  }

  updateUserPassword(form: NgForm, user_id: string) {
    this.hostgroupService.updateUserPasswordProfile(user_id, this.passwordModel.current_password, this.passwordModel.new_password, this.passwordModel.confirm_password).subscribe(response => {
      if(response == true) {
        this.userModel.current_password = '';
        this.userModel.new_password = '';
        this.userModel.confirm_password = '';

        this.alertService.success('Password modificata con successo.');
        this.loading = false;                  
      }
      else {
        this.alertService.error('Password errata');
        this.loading = false;
      }
    });    
  }

}
