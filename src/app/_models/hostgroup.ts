import { Host } from '../_models/index';

export class Hostgroup {
  _id: string;
  name: string;
  ip: string;
  port: number;
  status: string;
  state: string;
  description: string;
  default_group: string;
  groups: [string, number];
  hosts_down: number;
  hosts_pending: number;
  hosts_unreachable: number;
  hosts_up: number;
  services_crit: number;
  services_ok: number;
  services_pending: number;
  services_unknown: number;
  services_warn: number;

  constructor(_id: string, name: string, ip: string, port: number, status:string, state: string, description: string, default_group: string, groups: [string, number],
              hosts_down: number, hosts_pending: number, hosts_unreachable: number, hosts_up: number, services_crit: number, services_ok: number,
              services_pending: number, services_unknown: number, services_warn: number) {
  	this._id = _id;
  	this.name = name;
  	this.ip = ip;
  	this.port = port;
    this.status = status;
  	this.state = state;
    this.description = description;
    this.default_group = default_group;
    this.groups = groups;
    this.hosts_down = hosts_down;
    this.hosts_pending = hosts_pending;
    this.hosts_unreachable = hosts_unreachable;
    this.hosts_up = hosts_up;
    this.services_crit = services_crit;
    this.services_ok = services_ok;
    this.services_pending = services_pending;
    this.services_unknown = services_unknown;
    this.services_warn = services_warn;
  }

  public toggleState(): void {
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }

  /*public toggleGroupState(id): void {
    //this.groups[id] = this.state === 'active' ? 'inactive' : 'active';
    //console.log(id.count);
    //id.sta
    //id.state === 'active' ? 'inactive' : 'active';
    this.groups[id.count]['state'] = this.groups[id.count]['state'] === 'active' ? 'inactive' : 'active';
    console.log(this.groups[id.count]['state']);
  }*/
}
