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

// 없어도 앱은 뜨지만, 비어 있으면 해당 기능이 조용히 동작하지 않는 값들.
const optional = [
    {
        key: 'CRON_SECRET',
        reason: '만료된 연결 해제 커플 정리(/api/cron/couple-cleanup)가 동작하지 않습니다.',
    },
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

const missingOptional = optional.filter(entry => !values.get(entry.key));

if (missingOptional.length > 0) {
    console.warn('Optional environment variables are not set:');
    for (const entry of missingOptional) {
        console.warn(`- ${entry.key}: ${entry.reason}`);
    }
}

console.log(`Provider environment looks complete: ${envPath}`);
