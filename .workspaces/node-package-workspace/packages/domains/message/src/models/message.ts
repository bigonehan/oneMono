export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
  modified_at: string;
};

export type NewMessage = {
  sender_id: string;
  receiver_id: string;
  body: string;
};
