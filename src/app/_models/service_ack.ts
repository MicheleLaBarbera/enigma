export class ServiceAck {
  _id: string;
  host_id: string;
  service_id: string;
  customer_site_id: string;
  creator_name: string;
  message: string;
  created_at: string;  
  code: string;
  updated_at: string;

  constructor(_id: string, host_id: string, service_id: string, customer_site_id: string, creator_name: string, message: string, created_at: string, code: string, updated_at: string) {
    this._id = _id;
    this.host_id = host_id;
    this.service_id = service_id;
    this.customer_site_id = customer_site_id;
    this.creator_name = creator_name;
    this.message = message;
    this.created_at = created_at;  
    this.code = code;
    this.updated_at = updated_at;
  }
}
  