export interface ReplyMezonMessage {
  userId?: string;
  textContent?: string;
  messOptions?: {
    [x: string]: any;
  };
  avatar?: string;
  code?: number;
}