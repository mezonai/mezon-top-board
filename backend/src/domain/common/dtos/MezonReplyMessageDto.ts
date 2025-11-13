export interface ReplyMezonMessage {
  userId?: string;
  textContent?: string;
  messOptions?: {
    [x: string]: any;
  };
  code?: number;
}