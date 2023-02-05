export class Message {
  constructor(username: string, datetime: string, message: string) {
    this.username = username;
    this.datetime = datetime;
    this.message = message;
  }

  id?: number;
  username: string;
  datetime: string;
  message: string;
}
