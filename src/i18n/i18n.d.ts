import type messages from "./messages.json";

type Messages = typeof messages;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}
