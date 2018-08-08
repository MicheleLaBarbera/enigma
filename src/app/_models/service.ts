import { ServiceAck } from '../_models/index';

export class Service {
  _id: string;
  name: string;
  status: string;
  age: string;
  age_min: string;
  state: number;
  h_name: string;
  last_check: string;
  last_check_min: string;
  ack: ServiceAck;

  constructor(_id: string, name: string, status: string, age: string, age_min: string, state: number, h_name: string, last_check: string, last_check_min: string, ack: ServiceAck) {
    this._id = _id;
    this.name = name;
  	this.status = status;
  	this.age = age;
    this.age_min = age_min;
  	this.state = state;
    this.h_name = h_name;
    this.last_check = last_check;
    this.last_check_min = last_check_min;
    this.ack = ack;
  }
}
