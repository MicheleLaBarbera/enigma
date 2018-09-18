/*export class ServiceState {
    _id: string;
    plugin_output: string;
    service_state: number;
    service_last_state_change: number;
    host_name: string;
    service_last_check: number;    
    created_at: string;
    service_logs_docs: [string, number];
    host_logs_docs: [string, number];
    customer_site_logs_docs: [string, number];
    customer_logs_docs: [string, number];

    constructor(_id: string, plugin_output: string, service_state: number, service_last_state_change: number, host_name: string, service_last_check: number, 
                created_at: string, service_logs_docs: [string, number], host_logs_docs: [string, number], customer_site_logs_docs: [string, number], customer_logs_docs: [string, number]) {
        this._id = _id;     
        this.plugin_output = plugin_output;
        this.service_state = service_state;
        this.service_last_state_change = service_last_state_change;
        this.host_name = host_name; 
        this.service_last_check = service_last_check;
        this.created_at = created_at; 
        this.service_logs_docs = service_logs_docs;
        this.host_logs_docs = host_logs_docs;
        this.customer_site_logs_docs = customer_site_logs_docs;
        this.customer_logs_docs = customer_logs_docs; 
    }
}*/
    
export class ServiceState {
    customer_name: string;
    customer_site_description: string;
    host_alias: string;
    service_name: string;
    plugin_output: string;
    created_at: string;

    constructor(customer_name: string, customer_site_description: string, host_alias: string, service_name: string, plugin_output: string, created_at: string) {
        this.customer_name = customer_name;
        this.customer_site_description = customer_site_description;
        this.host_alias = host_alias;
        this.service_name = service_name;
        this.plugin_output = plugin_output;
        this.created_at = created_at;
    }
}