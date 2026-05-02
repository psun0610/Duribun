import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { apiBaseUrl, publicAnonKey, supabaseUrl } from "./info";

export const supabase = createSupabaseClient(supabaseUrl, publicAnonKey);

export const API_BASE = apiBaseUrl;

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<unknown> => {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token || publicAnonKey;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Network error" }));
    throw new Error((error as { error?: string }).error || "Request failed");
  }

  return response.json();
};
