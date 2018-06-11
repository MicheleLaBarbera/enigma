import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AlertService, AuthenticationService, HostgroupService, UserService } from '../_services/index';

import { Customer, User, Server } from '../_models/index';

import { Observable } from 'rxjs/Observable';

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
  public viewPanel: number;
  public viewTitle:  string;
  public customers: Customer[];
  public users: User[];
  public servers: Server[];
  public files: any[];
  key: string = 'companyname';
  reverse: boolean = false;
  p: number = 1;
  public companyedit: string;
  public companyeditid: number;

  constructor(private authenticationService: AuthenticationService, private alertService: AlertService, private hostgroupService: HostgroupService,
              private userService: UserService) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    this.files = [];
  }

  ngOnInit() {
    this.hostgroupService.getCustomers().subscribe(response => {
      this.customers = response;
      this.changeView(1, "Gestione Clienti", '', '');
    });

  }

  signup(form: NgForm) {
    this.loading = true;
    this.authenticationService.signup(this.model.firstname, this.model.lastname, this.model.username, this.model.password, this.model.customer, this.model.email).subscribe(response => {
      if(response.status == 201) {
        this.userService.getUsers().subscribe(response => {
          this.users = response;
        });
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

  changeView(value: number, title: string, extra: any, extra_id: any) {
    switch(value) {
      case 0: {
        this.userService.getUsers().subscribe(response => {
          this.users = response;
        });
        break;
      }
      case 2: {
        this.companyedit = extra;
        this.companyeditid = extra_id;
        this.hostgroupService.getCustomer(extra_id).subscribe(response => {
          this.servers = response;
          console.log(this.servers);
        });
        break;
      }
    }
    this.viewPanel = value;
    this.viewTitle = title;
  }

  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }

  onFileChanged(event: any) {
    this.files = event.target.files;
  }

  createCompany(form: NgForm) {
    var fileNameArray = this.files[0].name.split(".");
    var fileExtension = fileNameArray[fileNameArray.length - 1];

    if(fileExtension != 'jpg' && fileExtension != 'png' && fileExtension != 'gif') {
      this.alertService.error("Inserisci un'immagine con estensione JPG, PNG o GIF.");
    }
    else {
      this.fileReaderObs(this.files[0]).subscribe(fileContent => {
        this.hostgroupService.createCustomer(this.model.companyname, fileContent).subscribe(response => {
          if(response.status == 201) {
            this.alertService.success('Cliente registrato con successo.');
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
      });
    }
  }

  createServer(form: NgForm, customer_id: number) {
    this.loading = true;
    this.hostgroupService.createServer(this.model.description, this.model.address, this.model.port, customer_id).subscribe(response => {
      if(response.status == 201) {
        this.alertService.success('Sito registrato con successo.');
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

  private fileReaderObs(file : File)  {
    let reader = new FileReader();
    let fileReaderObs = Observable.create((observer: any) => {
      reader.onload = function() {
        observer.next(btoa(reader.result));
        observer.complete();
      }
    })
    reader.readAsBinaryString(file);
    return fileReaderObs;
  }



}
