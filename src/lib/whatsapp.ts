import { PHONES, type Phone } from '../config/site';
import { SHOW_BY_ID, type ShowId } from '../config/shows';

export interface BookingDetails {
  show?: ShowId | null;
  /** yyyy-mm-dd from <input type="date"> */
  date?: string;
  location?: string;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatEventDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return Number.isNaN(d.getTime()) ? isoDate : dateFormatter.format(d);
}

/** Single line, trimmed, length-capped free text for the message. */
export function cleanText(value: string, max = 80): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

export const GENERAL_MESSAGE =
  "Hello Kidventus! I'd love to book an event. Could you please provide me with more information about your shows, availability and pricing?";

export function buildMessage({ show, date, location }: BookingDetails = {}): string {
  const lines: string[] = [];
  lines.push(
    show
      ? `Hello Kidventus! I'm interested in booking ${SHOW_BY_ID[show].messageName}.`
      : "Hello Kidventus! I'd love to book an event and I'd like some help choosing the right show.",
  );
  if (date) lines.push(`Preferred date: ${formatEventDate(date)}`);
  const place = location ? cleanText(location) : '';
  if (place) lines.push(`Location: ${place}`);
  lines.push('Could you please provide me with more information about availability and pricing?');
  return lines.join('\n');
}

export function waLink(text: string = GENERAL_MESSAGE, phone: Phone = PHONES[0]): string {
  return `https://wa.me/${phone.wa}?text=${encodeURIComponent(text)}`;
}

export function showLink(show: ShowId, phone: Phone = PHONES[0]): string {
  return waLink(buildMessage({ show }), phone);
}
