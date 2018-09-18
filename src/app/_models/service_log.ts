export class ServiceLog {
  _id: string;
  service_id: string;  
  plugin_output: string;
  service_state: number;
  created_at: string;
  service_last_check: string;

  constructor(_id:string, service_id: string, plugin_output: string, service_state: number, created_at: string, service_last_check: string) {
    this._id = _id;
    this.service_id = service_id;
    this.plugin_output = plugin_output;
    this.service_state = service_state;
    this.created_at = created_at;  
    this.service_last_check = service_last_check;
  }
}
  