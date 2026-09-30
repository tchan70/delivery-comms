export interface NextDeliveryResponse {
  title: string;
  message: string;
  /** In pounds, for example 134 or 118.25. Format for display on the client. */
  totalPrice: number;
  freeGift: boolean;
}
