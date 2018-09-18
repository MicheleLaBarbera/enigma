export class Customer {
  _id: string;
  name: string;
  /*address: string;
  vat_number: string;*/
  customer_code: string;
  referent_name: string;
  phone_number: string;
  email: string;
  logo: any;

  constructor(_id: string, name: string, customer_code: string, referent_name: string, phone_number: string, email: string, logo:any) {
  	this._id = _id;
    this.name = name;
    this.customer_code = customer_code;
    this.referent_name = referent_name;
    this.phone_number = phone_number;
    this.email = email;
    this.logo = logo;
  }
}
