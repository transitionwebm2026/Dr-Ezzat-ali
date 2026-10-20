import { siteConfig } from '@/config/site';

/** `https://wa.me/<number>?text=<message>` — opens WhatsApp app/web with a pre-filled chat. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telUrl(phone: string = siteConfig.phone): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function mailUrl(email: string = siteConfig.email): string {
  return `mailto:${email}`;
}

/** Replaces `{key}` tokens in a translated template. */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
