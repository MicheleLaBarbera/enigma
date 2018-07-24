export class User {
  _id: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  logo: any;
  customer_name: string;
  email: string;
  token: string;
  role: number;

  constructor(_id: string, username: string, firstname: string, lastname: string, logo: any, customer_name: string, email: string, token: string, role: number) {
  	this._id = _id;
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.logo = logo;
    this.customer_name = customer_name;
    this.email = email;
    this.token = token;
    this.role = role;
  }
}
