export class User {
  id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  logo: any;
  companyname: string;

  constructor(id: number, username: string, firstname: string, lastname: string, logo: any, companyname: string) {
  	this.id = id;
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.logo = logo;
    this.companyname = companyname;
  }
}
