/** Mirrors NextDeliveryResponse in the API (src/comms/comms.types.ts). */
export interface NextDeliveryResponse {
  title: string;
  message: string;
  /** In pounds, for example 134 or 118.25. */
  totalPrice: number;
  freeGift: boolean;
}
