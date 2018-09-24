export class ServiceChange {
    customer_name: string;
    customer_site_description: string;
    host_alias: string;
    service_name: string;
    plugin_output: string;
    created_at: string;
    date: string;
    time: string;

    constructor(customer_name: string, customer_site_description: string, host_alias: string, service_name: string, plugin_output: string, created_at: string, date: string, time: string) {
        this.customer_name = customer_name;
        this.customer_site_description = customer_site_description;
        this.host_alias = host_alias;
        this.service_name = service_name;
        this.plugin_output = plugin_output;
        this.created_at = created_at;
        this.date = date;
        this.time = time;
    }
}