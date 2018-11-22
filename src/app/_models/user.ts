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
  customer_id: string;
  telegram_id: string;
  phone_number: string;
  office_number: string;

  constructor(_id: string, username: string, firstname: string, lastname: string, logo: any, customer_name: string, email: string, token: string, 
              role: number, customer_id: string, telegram_id: string, phone_number: string, office_number: string) {
  	this._id = _id;
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.logo = logo;
    this.customer_name = customer_name;
    this.email = email;
    this.token = token;
    this.role = role;
    this.customer_id = customer_id;
    this.telegram_id = telegram_id;
    this.phone_number = phone_number;
    this.office_number = office_number;
  }
}
