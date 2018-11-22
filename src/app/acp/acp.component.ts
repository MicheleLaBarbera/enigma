import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AlertService, AuthenticationService, HostgroupService, UserService } from '../_services/index';

import { Customer, User, Server, Hostgroup, UserLog } from '../_models/index';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-acp',
  templateUrl: './acp.component.html',
  styleUrls: ['./acp.component.css']
})
export class AcpComponent implements OnInit {
  public token: string;
  @ViewChild('f') form: any;

  @ViewChild('customerForm') customerForm: any;
  public customerModel: any = {};

  @ViewChild('userForm') userForm: any;
  public userModel: any = {};

  @ViewChild('logForm') logForm: any;
  public logModel: any = {};

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

  public page_users: number = 1;
  public page_customers: number = 1;
  public page_customer_sites: number = 1;
  public page_user_sites: number = 1;

  public companyedit: string;
  public companyeditid: number;

  public user_hostgroups: Hostgroup[];

  public user_logs: UserLog[];
 

  public use_customer: Customer;
  public use_customer_site: Server;
  public use_user: User;

  @ViewChild('btnCustomerClose') btnCustomerClose : ElementRef;
  @ViewChild('btnUserClose') btnUserClose : ElementRef;
  @ViewChild('btnCustomerSiteClose') btnCustomerSiteClose : ElementRef;
  @ViewChild('btnCustomerCreate') btnCustomerCreate : ElementRef;
  @ViewChild('btnUserCreate') btnUserCreate : ElementRef;
  @ViewChild('btnUserSiteClose') btnUserSiteClose : ElementRef;

  
  public customerAlert: number = 0;  

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

  public useUser(user: User) {
    this.use_user = user;

    this.alertService.resetMessage();
  }

  public useCustomerSiteEdit(customerSite: Server) {
    this.use_customer_site = customerSite;
    this.alertService.resetMessage();
  }

  public useCustomerEdit(customer: Customer) {
    this.use_customer = customer;

    this.customerModel.companyname = this.use_customer.name;
    this.customerModel.customer_code = this.use_customer.customer_code;
    this.customerModel.referent_name = this.use_customer.referent_name;
    this.customerModel.phone_number = this.use_customer.phone_number;
    this.customerModel.email = this.use_customer.email;

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

  public deleteUser(user_id: string) {   
    this.hostgroupService.deleteUser(user_id).subscribe(response => {
      if(response) {
        this.userService.getUsers().subscribe(response => {
          this.users = response;
          this.btnUserClose.nativeElement.click();
        });
      }   
    });
  }

  public deleteUserCustomerSite(user_id: string, site_id: string) {
    this.hostgroupService.deleteUserCustomerSite(user_id, site_id).subscribe(response => {
      if(response) {
        this.hostgroupService.getUserSites(user_id).subscribe(response => {
          this.user_sites = response;
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

  public searchLog() {
    this.hostgroupService.getUserLogs(this.logModel.user, this.logModel.action).subscribe(response => {
      if(response) {        
        this.user_logs = response;
        if(this.user_logs) {
          for(let user_log of this.user_logs) {
            user_log.action_type = this.getActionDescription(user_log.action_type);
          }
        }
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
        this.userService.getUsers().subscribe(response => {
          this.users = response;
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
    this.loading = true;
    if(this.files[0] != undefined) {
      var fileNameArray = this.files[0].name.split(".");
      var fileExtension = fileNameArray[fileNameArray.length - 1];

      if(fileExtension != 'jpg' && fileExtension != 'png' && fileExtension != 'gif') {
        this.alertService.error("Inserisci un'immagine con estensione JPG, PNG o GIF.");
      }
      else {
        this.fileReaderObs(this.files[0]).subscribe(fileContent => {
          this.hostgroupService.updateCustomer(customer._id, this.customerModel.companyname, this.customerModel.customer_code, this.customerModel.referent_name, this.customerModel.phone_number, this.customerModel.email, fileContent).subscribe(response => {
            if(response.status == 200) {
              this.hostgroupService.getCustomers().subscribe(response => {                
                this.customers = response;     

                this.customerAlert = 1;
                this.alertService.success('Cliente modificato con successo.');
                this.loading = false;      
              });                       
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
      this.hostgroupService.updateCustomer(customer._id, this.customerModel.companyname, this.customerModel.customer_code, this.customerModel.referent_name, this.customerModel.phone_number, this.customerModel.email, 'invalid').subscribe(response => {
        if(response.status == 200) {
          this.hostgroupService.getCustomers().subscribe(response => {                
            this.customers = response;  

            this.customerAlert = 1;
            this.alertService.success('Cliente modificato con successo.');
            this.loading = false;     
             
          });
                    
        }
        else {
          this.alertService.error(response.body.message);
          this.loading = false;
        }
      });
    }
  }

  updateServer(form: NgForm, customer_site: Server, customer: Customer) {
    this.hostgroupService.updateCustomerSite(customer_site._id, this.model.description, this.model.address, this.model.port).subscribe(response => {
      if(response.status == 200) {
        this.hostgroupService.getCustomer(customer._id).subscribe(response => {
          this.servers = response;          
        });
        this.customerAlert = 0;
        this.alertService.success('Sito modificato con successo.');
        this.loading = false;               
      }
      else {

        this.alertService.error(response.body.message);
        this.loading = false;
      }
    });    
  }

  updateUser(form: NgForm, user: User) {
    this.hostgroupService.updateUser(user._id, this.userModel.firstname, this.userModel.lastname, this.userModel.username, this.userModel.email, 
                                    this.userModel.customer, this.userModel.role, this.userModel.telegram_id, this.userModel.phone_number, 
                                    this.userModel.office_number).subscribe(response => {
      if(response.status == 200) {
        this.userService.getUsers().subscribe(response => {
          this.users = response;   

          this.alertService.success('Utente modificato con successo.');
          this.loading = false;           
        });
                   
      }
      else {

        this.alertService.error(response.body.message);
        this.loading = false;
      }
    });    
  }

  createServer(form: NgForm, customer_id: string) {
    console.log(this.model);
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

    this.userModel.firstname = this.use_user.firstname;
    this.userModel.lastname = this.use_user.lastname;
    this.userModel.username = this.use_user.username;
    this.userModel.email = this.use_user.email;
    this.userModel.customer = this.use_user.customer_id;
    this.userModel.role = this.use_user.role;
    this.userModel.telegram_id = this.use_user.telegram_id;
    this.userModel.phone_number = this.use_user.phone_number;
    this.userModel.office_number = this.use_user.office_number;

    this.alertService.resetMessage();

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

  public getActionDescription(action_type) {
    let i = 0;
    for(let desc of this.actionDescriptions) {
      if(desc.type == action_type)
        return i;
      i++;
    }
  }
  public actionDescriptions = [
    {
      'type': 19,
      'description': "AZIONI UTENTE",
      'bold': 1
    },
    {
      'type': 11, 
      'description': "Login",
      'bold': 0
    },
    {
      'type': 12, 
      'description': "Logout",
      'bold': 0
    },
    {
      'type': 13,
      'description': "Cambio password",
      'bold': 0      
    },
    {
      'type': 14,
      'description': "Recupera password",
      'bold': 0
    },
    {
      'type': 15,
      'description': "Modifica informazioni",
      'bold': 0
    },
    {
      'type': 16,
      'description': "AZIONI ADMIN CLIENTI",
      'bold': 1
    },
    {
      'type': 0, 
      'description': "Creazione cliente",
      'bold': 0
    },
    {
      'type': 1, 
      'description': "Eliminazione cliente",
      'bold': 0
    },
    {
      'type': 2, 
      'description': "Modifica cliente",
      'bold': 0
    },
    {
      'type': 17,
      'description': "AZIONI ADMIN SITI",
      'bold': 1
    },
    {
      'type': 3, 
      'description': "Creazione sito",
      'bold': 0
    },
    {
      'type': 4, 
      'description': "Eliminazione sito",
      'bold': 0
    },
    {
      'type': 5, 
      'description': "Modifica sito",
      'bold': 0
    },
    {
      'type': 18,
      'description': "AZIONI ADMIN UTENTI",
      'bold': 1
    },
    {
      'type': 6, 
      'description': "Creazione utente",
      'bold': 0
    },
    {
      'type': 7, 
      'description': "Eliminazione utente",
      'bold': 0
    },
    {
      'type': 8, 
      'description': "Modifica utente",
      'bold': 0
    },
    {
      'type': 9, 
      'description': "Modifica utente - Aggiungi sito",
      'bold': 0
    },
    {
      'type': 10,
      'description': "Modifica utente - Elimina sito",
      'bold': 0
    },
  ]

}
