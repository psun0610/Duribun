const getRequiredPublicEnv = (key: string, value: string | undefined) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const supabaseUrl = getRequiredPublicEnv(
  "NEXT_PUBLIC_SUPABASE_URL",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);

export const publicAnonKey = getRequiredPublicEnv(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const apiBaseUrl = getRequiredPublicEnv(
  "NEXT_PUBLIC_SUPABASE_FUNCTION_BASE_URL",
  process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_BASE_URL,
);
