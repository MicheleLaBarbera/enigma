import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AlertService, AuthenticationService, HostgroupService, UserService } from '../_services/index';

import { Customer, User } from '../_models/index';

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
  public files: any[];
  key: string = 'companyname';
  reverse: boolean = false;
  p: number = 1;

  constructor(private authenticationService: AuthenticationService, private alertService: AlertService, private hostgroupService: HostgroupService,
              private userService: UserService) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    this.files = [];
  }

  ngOnInit() {
    this.hostgroupService.getCustomers().subscribe(response => {
      this.customers = response;
      this.changeView(0, "Amministrazione Utenti");
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

  changeView(value: number, title: string) {
    switch(value) {
      case 0: {
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
    //const formData = new FormData();
    console.log(this.files[0]);
    //for (const file of this.files) {
        //console.log(file);
        //formData.append(name, file, file.name);
    //}
    //console.log(formData);

    var fileNameArray = this.files[0].name.split(".");
    var fileExtension = fileNameArray[fileNameArray.length - 1];

    if(fileExtension != 'jpg' && fileExtension != 'png' && fileExtension != 'gif') {
      this.alertService.error("Inserisci un'immagine con estensione JPG, PNG o GIF.");
    }
    else {
      this.fileReaderObs(this.files[0]).subscribe(fileContent => {
        console.log("Content: ", fileContent);
        var blob = b64toBlob(fileContent, 'img');
        console.log("Content Blob: ", blob);
        /*this.hostgroupService.createCustomer(this.model.companyname, fileContent).subscribe(response => {
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
          /*if(result.status === 200) {
            this.modalService.success("Upload Completato", "http://localhost:4200/download/" + result.id);
          }
          else {
            console.log("Failed");
          }
        });*/
      });
    }
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

  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

}
