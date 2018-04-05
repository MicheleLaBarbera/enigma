export class Infrastructure {
  id: number;
  name: string;
  ip: string;
  port: number;
  status: string;
  state: string;
  description: string;
  hostgroups: [string, number];

  constructor(id: number, name: string, ip: string, port: number, status:string, state: string, description: string, hostgroups: [string, number]) {
  	this.id = id;
  	this.name = name;
  	this.ip = ip;
  	this.port = port;
    this.status = status;
  	this.state = state;
    this.description = description;
    this.hostgroups = hostgroups;
  }

  public toggleState(): void {
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }
}