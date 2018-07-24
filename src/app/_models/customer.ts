export class Customer {
  _id: string;
  name: string;
  logo: any;

  constructor(_id: string, name: string, logo:any) {
  	this._id = _id;
    this.name = name;
    this.logo = logo;
  }
}
