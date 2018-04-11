export class Service {
  address: string;
  alias: string;
  groups: string;
  crit: string;
  ok: string;
  unknown: string;
  warn: string;

  constructor(address: string, alias: string, groups: string, crit: string, ok:string, unknown: string, warn: string) {
  	this.address = address;
  	this.alias = alias;
  	this.groups = groups;
  	this.crit = crit;
    this.ok = ok;
  	this.unknown = unknown;
    this.warn = warn;
  }
}
