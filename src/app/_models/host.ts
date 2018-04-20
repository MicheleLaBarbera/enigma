export class Host {
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

  constructor(address: string, alias: string, groups: string, crit: string, ok:string, unknown: string, warn: string, name: string, ip:string, port: number) {
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
  }
}
