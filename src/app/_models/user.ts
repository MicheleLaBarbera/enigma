export class User {
  id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  logo: any;
  companyname: string;
  email: string;
  token: string;
  role: number;

  constructor(id: number, username: string, firstname: string, lastname: string, logo: any, companyname: string, email: string, token: string, role: number) {
  	this.id = id;
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.logo = logo;
    this.companyname = companyname;
    this.email = email;
    this.token = token;
    this.role = role;
  }
}
