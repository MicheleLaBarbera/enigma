export class Server {
  _id: number;
  description: string;
  ip_address: string;
  port_number: number;

  constructor(_id: number, description: string, ip_address: string, port_number: number) {
  	this._id = _id;
    this.description = description;
    this.ip_address = ip_address;
    this.port_number = port_number;
  }
}
