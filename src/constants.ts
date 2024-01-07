export const localStorageKeys = {
  nwcUrl: "pos:nwcUrl",
};

// TODO: allow dynamic list of relays
export const RELAYS = ["wss://relay.damus.io", "wss://relay.shitforce.one"];
export const appCustomDataTag = "buzzpay";
export const appCustomDataValues = {
  profilePubkey: "profilePubkey",
  item: "item",
};

// https://bitcoin.stackexchange.com/questions/85951/whats-the-maximum-size-of-the-memo-in-a-ln-payment-request
export const MAX_MEMO_LENGTH = 159;
