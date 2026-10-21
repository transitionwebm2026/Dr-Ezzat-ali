import type { Locale } from '@/i18n/config';
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from './env';

export type ConsultationInput = {
  patient_name: string;
  phone: string;
  preferred_date: string | null;
  consultation_type: string;
  notes: string | null;
  locale: Locale;
};

/**
 * Stores a booking request in `public.consultations` (insert-only for visitors under RLS).
 * Fire-and-forget on purpose: WhatsApp is the primary channel, so a network error must never block
 * the patient. A bare `fetch` with `keepalive` keeps supabase-js out of the public bundle and survives
 * the page navigating to WhatsApp.
 */
export function saveConsultation(input: ConsultationInput): void {
  if (!isSupabaseConfigured) return;
  const headers: Record<string, string> = {
    apikey: supabaseAnonKey,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  };
  // Legacy anon keys are JWTs and go in Authorization too; new `sb_publishable_…` keys must not.
  if (supabaseAnonKey.startsWith('eyJ')) headers.Authorization = `Bearer ${supabaseAnonKey}`;

  fetch(`${supabaseUrl}/rest/v1/consultations`, {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
    keepalive: true,
  }).catch(() => {
    // Ignored: the WhatsApp message already carries the request.
  });
}
