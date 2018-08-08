export class ServiceAck {
    service_id: string;
    creator_name: string;
    message: string;
    created_at: string;
    expire_at: string;
  
    constructor(service_id: string, creator_name: string, message: string, created_at: string, expire_at: string) {
      this.service_id = service_id;
      this.creator_name = creator_name;
      this.message = message;
      this.created_at = created_at;  
      this.expire_at = expire_at;
    }
  }
  