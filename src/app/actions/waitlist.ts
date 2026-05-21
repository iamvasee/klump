'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

// Use the service role client so we can bypass RLS for the count check
// but the insert itself goes through RLS (anon policy allows it)
function getServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

export interface WaitlistFormData {
  name: string;
  email: string;
  organization: string;
  role: string;
  challenge: string;
}

export interface WaitlistResult {
  success: boolean;
  error?: string;
  isFull?: boolean;
}

export async function submitWaitlist(
  formData: WaitlistFormData
): Promise<WaitlistResult> {
  const supabase = getServiceClient();

  // Validate required fields
  if (
    !formData.name ||
    !formData.email ||
    !formData.organization ||
    !formData.role
  ) {
    return { success: false, error: 'All required fields must be filled.' };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    // Check current count
    const { count, error: countError } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Waitlist count error:', countError);
      return {
        success: false,
        error: 'Something went wrong. Please try again.',
      };
    }

    if (count !== null && count >= 25) {
      return {
        success: false,
        isFull: true,
        error: "The waitlist is currently full. We'll open more spots soon.",
      };
    }

    // Check for duplicate email
    const { data: existing } = await supabase
      .from('waitlist_signups')
      .select('id')
      .eq('email', formData.email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: 'This email is already on the waitlist.',
      };
    }

    // Insert the signup
    const { error: insertError } = await supabase
      .from('waitlist_signups')
      .insert({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        organization: formData.organization.trim(),
        role: formData.role,
        challenge: formData.challenge?.trim() || null,
      });

    if (insertError) {
      console.error('Waitlist insert error:', insertError);
      if (insertError.message.includes('Waitlist is full')) {
        return {
          success: false,
          isFull: true,
          error: "The waitlist just filled up. We'll open more spots soon.",
        };
      }
      if (insertError.message.includes('duplicate key')) {
        return {
          success: false,
          error: 'This email is already on the waitlist.',
        };
      }
      return {
        success: false,
        error: 'Something went wrong. Please try again.',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Waitlist submission error:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function getWaitlistCount(): Promise<number> {
  const supabase = getServiceClient();
  const { count } = await supabase
    .from('waitlist_signups')
    .select('*', { count: 'exact', head: true });
  return count ?? 0;
}
