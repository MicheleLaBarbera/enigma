export class Service {
  name: string;
  status: string;
  age: string;
  state: number;
  h_name: string;
  last_check: string;

  constructor(name: string, status: string, age: string, state: number, h_name: string, last_check: string) {
  	this.name = name;
  	this.status = status;
  	this.age = age;
  	this.state = state;
    this.h_name = h_name;
    this.last_check = last_check;
  }
}
