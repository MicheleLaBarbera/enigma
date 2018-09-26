import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AlertService, AuthenticationService, HostgroupService, UserService } from '../_services/index';

import { Customer, User, Server, Hostgroup } from '../_models/index';

import { Observable } from 'rxjs';

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
  public user_sites: Server[];
  public sites: Server[];
  public files: any[];
  key: string = 'companyname';
  reverse: boolean = false;
  p: number = 1;
  public companyedit: string;
  public companyeditid: number;

  public user_hostgroups: Hostgroup[];
 

  public use_customer: Customer;
  public use_user: User;

  @ViewChild('btnCustomerClose') btnCustomerClose : ElementRef;
  @ViewChild('btnCustomerSiteClose') btnCustomerSiteClose : ElementRef;
  @ViewChild('btnCustomerCreate') btnCustomerCreate : ElementRef;
  @ViewChild('btnUserCreate') btnUserCreate : ElementRef;
  @ViewChild('btnUserSiteClose') btnUserSiteClose : ElementRef;

  
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

  public useCustomer(customer: Customer) {
    this.use_customer = customer;
    this.alertService.resetMessage();
  }

  public useCustomerEdit(customer: Customer) {
    this.use_customer = customer;
    this.alertService.resetMessage();

    this.hostgroupService.getCustomer(customer._id).subscribe(response => {
      this.servers = response;          
    });
  }

  public resetAlertMessage() {
    this.alertService.resetMessage();
  }

  public deleteCustomer(customer_id: string) {   
    this.hostgroupService.deleteCustomer(customer_id).subscribe(response => {
      if(response) {
        this.hostgroupService.getCustomers().subscribe(response => {
          this.customers = response;      
          this.btnCustomerClose.nativeElement.click();
        }); 
      }
      else {
        this.alertService.error("Impossibile eliminare un cliente con siti associati.");
      }
    });
  }

  public deleteCustomerSite(customer_id: string, site_id: string) {   
    this.hostgroupService.deleteCustomerSite(customer_id, site_id).subscribe(response => {
      if(response) {
        this.hostgroupService.getCustomer(customer_id).subscribe(response => {
          this.servers = response;          
        });    
      }   
    });
  }

  signup(form: NgForm) {
    this.loading = true;
    this.authenticationService.signup(this.model.firstname, this.model.lastname, this.model.username, this.model.password, this.model.customer, this.model.email, this.model.role).subscribe(response => {
      if(response.status == 201) {        
        this.userService.getUsers().subscribe(response => {
          this.users = response;          
          this.btnUserCreate.nativeElement.click();
        });                
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
    if(this.files[0] != undefined) {
      var fileNameArray = this.files[0].name.split(".");
      var fileExtension = fileNameArray[fileNameArray.length - 1];

      if(fileExtension != 'jpg' && fileExtension != 'png' && fileExtension != 'gif') {
        this.alertService.error("Inserisci un'immagine con estensione JPG, PNG o GIF.");
      }
      else {
        this.fileReaderObs(this.files[0]).subscribe(fileContent => {
          this.hostgroupService.createCustomer(this.model.companyname, this.model.customer_code, this.model.referent_name, this.model.phone_number, this.model.email, fileContent).subscribe(response => {
            if(response.status == 201) {
              this.hostgroupService.getCustomers().subscribe(response => {
                this.btnCustomerCreate.nativeElement.click();
                this.customers = response;                   
              });
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
    else {
      this.alertService.error("Inserisci un'immagine come logo.");
    }
  }

  updateCustomer(form: NgForm, customer: Customer) {
    if(this.files[0] != undefined) {
      var fileNameArray = this.files[0].name.split(".");
      var fileExtension = fileNameArray[fileNameArray.length - 1];

      if(fileExtension != 'jpg' && fileExtension != 'png' && fileExtension != 'gif') {
        this.alertService.error("Inserisci un'immagine con estensione JPG, PNG o GIF.");
      }
      else {
        this.fileReaderObs(this.files[0]).subscribe(fileContent => {
          this.hostgroupService.updateCustomer(customer._id, this.model.companyname, this.model.customer_code, this.model.referent_name, this.model.phone_number, this.model.email, fileContent).subscribe(response => {
            if(response.status == 200) {
              this.hostgroupService.getCustomers().subscribe(response => {                
                this.customers = response;                   
              });
              this.alertService.success('Cliente modificato con successo.');
              this.loading = false;               
            }
            else {
              this.alertService.error(response.body.message);
              this.loading = false;
            }
          });
        });
      }
    }
    else {
      this.hostgroupService.updateCustomer(customer._id, this.model.companyname, this.model.customer_code, this.model.referent_name, this.model.phone_number, this.model.email, 'invalid').subscribe(response => {
        if(response.status == 200) {
          this.hostgroupService.getCustomers().subscribe(response => {                
            this.customers = response;                   
          });
          this.alertService.success('Cliente modificato con successo.');
          this.loading = false;               
        }
        else {
          this.alertService.error(response.body.message);
          this.loading = false;
        }
      });
    }
  }

  createServer(form: NgForm, customer_id: string) {
    this.loading = true;
    this.hostgroupService.createServer(this.model.description, this.model.address, this.model.port, customer_id).subscribe(response => {
      if(response.status == 201) {
        this.btnCustomerSiteClose.nativeElement.click();
        this.hostgroupService.getCustomer(customer_id).subscribe(response => {
          this.servers = response;          
        });       
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

  createUserSite(form: NgForm, user_id: string) {
    console.log(this.model.customer_site + " - " + user_id);
    this.loading = true;
    this.hostgroupService.createUserSite(user_id, this.model.customer_site, 0, 0, 0, 0).subscribe(response => {    
      if(response.status == 201) {
        this.btnUserSiteClose.nativeElement.click();
        this.hostgroupService.getUserSites(user_id).subscribe(response => {
          this.user_sites = response;
        });   
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

  public editUser(user: User) {
    this.use_user = user;

    this.hostgroupService.getUserSites(user._id).subscribe(response => {
      this.user_sites = response;
    });
  }

  public loadSites() {   
    this.hostgroupService.getCustomerSites().subscribe(response => {
      this.sites = response;
  });
    /*this.eu_id = id;
    for(let user of this.users) {
      if(user._id == id) {
        this.eu_username = user.username;
        this.eu_firstname = user.firstname;
        this.eu_lastname = user.lastname;
      }
    }

    this.hostgroupService.getHostgroupsByUser(id).subscribe(response => {
      this.user_hostgroups = response;
    });*/
  }

}
