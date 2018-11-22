export class ServiceState {
    customer_name: string;
    customer_site_description: string;
    host_alias: string;
    service_name: string;
    plugin_output: string;
    created_at: string;
    author: string;
    _id: string;
    service_id: string;
    code: string;
    state: number;

    constructor(customer_name: string, customer_site_description: string, host_alias: string, service_name: string, plugin_output: string, 
                created_at: string, author: string, _id: string, service_id: string, code: string, state: number) {
        this.customer_name = customer_name;
        this.customer_site_description = customer_site_description;
        this.host_alias = host_alias;
        this.service_name = service_name;
        this.plugin_output = plugin_output;
        this.created_at = created_at;
        this.author = author;
        this._id = _id;
        this.service_id = service_id;
        this.code = code;
        this.state = state;
    }
}