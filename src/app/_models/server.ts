export class Server {
  id: number;
  description: string;
  ip_address: string;
  port_number: number;

  constructor(id: number, description: string, ip_address: string, port_number: number) {
  	this.id = id;
    this.description = description;
    this.ip_address = ip_address;
    this.port_number = port_number;
  }
}
