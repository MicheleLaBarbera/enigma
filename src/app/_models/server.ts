export class Server {
  _id: number;
  description: string;
  ip_address: string;
  port_number: number;
  customer_name: string;

  constructor(_id: number, description: string, ip_address: string, port_number: number, customer_name: string) {
  	this._id = _id;
    this.description = description;
    this.ip_address = ip_address;
    this.port_number = port_number;
    this.customer_name = customer_name;
  }
}
