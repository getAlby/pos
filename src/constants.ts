export const localStorageKeys = {
  nwcUrl: "pos:nwcUrl",
};

export const appCustomDataTag = "buzzpay";
export const appCustomDataValues = {
  profilePubkey: "profilePubkey",
  item: "item",
};

// https://bitcoin.stackexchange.com/questions/85951/whats-the-maximum-size-of-the-memo-in-a-ln-payment-request
export const MAX_MEMO_LENGTH = 159;

export const CURRENCIES = [
  { currency: "USD", country: "us" },
  { currency: "GBP", country: "gb" },
  { currency: "EUR", country: "eu" },
  { currency: "CAD", country: "ca" },
  { currency: "JPY", country: "jp" },
  { currency: "AUD", country: "au" }, 
  { currency: "CHF", country: "ch" },
  { currency: "CNY", country: "cn" },
  { currency: "HKD", country: "hk" },
  { currency: "NZD", country: "nz" }
];
