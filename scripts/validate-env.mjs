import fs from 'node:fs';
import path from 'node:path';

const envFile = process.argv[2] ?? '.env.local';
const envPath = path.resolve(process.cwd(), envFile);

const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SITE_URL',
    'KAKAO_REST_API_KEY',
    'KAKAO_LOCAL_API_BASE_URL',
    'SUPABASE_AUTH_KAKAO_CLIENT_ID',
    'SUPABASE_AUTH_KAKAO_CLIENT_SECRET',
    'SUPABASE_AUTH_GOOGLE_CLIENT_ID',
    'SUPABASE_AUTH_GOOGLE_CLIENT_SECRET',
    'SUPABASE_AUTH_NAVER_PROVIDER_ID',
    'SUPABASE_AUTH_NAVER_CLIENT_ID',
    'SUPABASE_AUTH_NAVER_CLIENT_SECRET',
];

const parseDotEnv = contents => {
    const values = new Map();

    for (const rawLine of contents.split(/\r?\n/)) {
        const line = rawLine.trim();

        if (!line || line.startsWith('#')) {
            continue;
        }

        const separator = line.indexOf('=');

        if (separator === -1) {
            continue;
        }

        const key = line.slice(0, separator).trim();
        let value = line.slice(separator + 1).trim();

        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        values.set(key, value);
    }

    return values;
};

if (!fs.existsSync(envPath)) {
    console.error(`Missing environment file: ${envPath}`);
    console.error(
        'Create it from .env.example and fill provider credentials before starting the app.'
    );
    process.exit(1);
}

const values = parseDotEnv(fs.readFileSync(envPath, 'utf8'));
const missing = required.filter(key => !values.get(key));

if (missing.length > 0) {
    console.error('Missing required provider environment variables:');
    for (const key of missing) {
        console.error(`- ${key}`);
    }
    console.error(
        'Fill these values in your local env file before starting the app.'
    );
    process.exit(1);
}

console.log(`Provider environment looks complete: ${envPath}`);
