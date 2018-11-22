export class UserLog {
  _id: string;
  user_id: string;  
  action_type: number;
  message: string;
  created_at: string;
  receiver_id: string;

  constructor(_id:string, user_id: string, action_type: number, message: string, created_at: string, receiver_id: string) {
    this._id = _id;
    this.user_id = user_id;
    this.action_type = action_type;
    this.message = message;
    this.created_at = created_at;  
    this.receiver_id = receiver_id;
  }
}
  