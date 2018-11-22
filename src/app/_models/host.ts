export class Host {
  _id: string;
  address: string;
  alias: string;
  groups: string;
  crit: string;
  ok: string;
  unknown: string;
  warn: string;
  name: string;
  ip: string;
  port: number;
  hard_state: number;
  name_ex: string;
  site: string;
  acks: number;
  ack_num: number;

  constructor(_id: string, address: string, alias: string, groups: string, crit: string, ok:string, unknown: string, warn: string, 
              name: string, ip:string, port: number, hard_state: number, name_ex: string, site: string, acks: number, ack_num: number) {
    this._id = _id;
    this.address = address;
  	this.alias = alias;
  	this.groups = groups;
  	this.crit = crit;
    this.ok = ok;
  	this.unknown = unknown;
    this.warn = warn;
    this.name = name;
    this.ip = ip;
    this.port = port;
    this.hard_state = hard_state;
    this.name_ex = name_ex;
    this.site = site;
    this.acks = acks;
    this.ack_num = ack_num
  }
}
