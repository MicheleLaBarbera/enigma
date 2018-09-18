export class ServiceAck {
  _id: string;
  host_id: string;
  service_id: string;
  creator_name: string;
  message: string;
  created_at: string;  

  constructor(_id: string, host_id: string, service_id: string, creator_name: string, message: string, created_at: string) {
    this._id = _id;
    this.host_id = host_id;
    this.service_id = service_id;
    this.creator_name = creator_name;
    this.message = message;
    this.created_at = created_at;  
  }
}
  