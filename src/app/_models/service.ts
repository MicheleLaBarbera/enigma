export class Service {
  name: string;
  status: string;
  age: string;
  state: number;
  h_name: string;

  constructor(name: string, status: string, age: string, state: number, h_name: string) {
  	this.name = name;
  	this.status = status;
  	this.age = age;
  	this.state = state;
    this.h_name = h_name;
  }
}
