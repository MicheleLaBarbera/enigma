export class HostLog {
    _id: string;
    host_id: string;
    created_at: string;
    host_num_services_crit: number;
    host_num_services_ok: number;
    host_num_services_unknown: number;
    host_num_services_warn: number;
    hard_state: number;
  
    constructor(_id: string, host_id: string, created_at: string, host_num_services_crit: number, host_num_services_ok: number, 
                host_num_services_unknown: number, host_num_services_warn: number, hard_state: number) {
      this._id = _id;
      this.host_id = host_id;
      this.created_at = created_at;  
      this.host_num_services_crit = host_num_services_crit;
      this.host_num_services_ok = host_num_services_ok;
      this.host_num_services_unknown = host_num_services_unknown;
      this.host_num_services_warn = host_num_services_warn;
      this.hard_state = hard_state;
    }
  }
  