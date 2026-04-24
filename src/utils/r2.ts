import { AwsClient } from 'aws4fetch';
import { supabase } from './supabase';

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicBaseUrl: string;
}

async function getR2Config(): Promise<R2Config> {
  const { data, error } = await supabase
    .from('app_config')
    .select('key, value')
    .in('key', [
      'r2_account_id',
      'r2_access_key_id',
      'r2_secret_access_key',
      'r2_bucket_name',
      'r2_public_base_url',
    ]);

  if (error || !data?.length) throw new Error('R2 credentials not configured');

  const cfg: Record<string, string> = {};
  data.forEach(row => { cfg[row.key] = row.value; });

  const required = ['r2_account_id', 'r2_access_key_id', 'r2_secret_access_key', 'r2_bucket_name', 'r2_public_base_url'];
  for (const k of required) {
    if (!cfg[k]) throw new Error(`Missing R2 config key: ${k}`);
  }

  return {
    accountId:       cfg['r2_account_id'],
    accessKeyId:     cfg['r2_access_key_id'],
    secretAccessKey: cfg['r2_secret_access_key'],
    bucketName:      cfg['r2_bucket_name'],
    publicBaseUrl:   cfg['r2_public_base_url'].replace(/\/$/, ''),
  };
}

export async function saveR2Config(config: Partial<R2Config>): Promise<void> {
  const keyMap: Record<string, string> = {
    accountId:       'r2_account_id',
    accessKeyId:     'r2_access_key_id',
    secretAccessKey: 'r2_secret_access_key',
    bucketName:      'r2_bucket_name',
    publicBaseUrl:   'r2_public_base_url',
  };

  const rows = Object.entries(config)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => ({ key: keyMap[k], value: v as string }));

  if (!rows.length) return;
  await supabase.from('app_config').upsert(rows, { onConflict: 'key' });
}

export async function loadR2Config(): Promise<Partial<R2Config>> {
  const { data } = await supabase
    .from('app_config')
    .select('key, value')
    .in('key', [
      'r2_account_id', 'r2_access_key_id', 'r2_secret_access_key',
      'r2_bucket_name', 'r2_public_base_url',
    ]);

  if (!data?.length) return {};

  const cfg: Record<string, string> = {};
  data.forEach(row => { cfg[row.key] = row.value; });

  return {
    accountId:       cfg['r2_account_id']         ?? '',
    accessKeyId:     cfg['r2_access_key_id']       ?? '',
    secretAccessKey: cfg['r2_secret_access_key']   ?? '',
    bucketName:      cfg['r2_bucket_name']         ?? '',
    publicBaseUrl:   cfg['r2_public_base_url']     ?? '',
  };
}

export async function uploadTopicJson(
  slug: string,
  payload: object
): Promise<string> {
  const config = await getR2Config();

  const aws = new AwsClient({
    accessKeyId:     config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service:         's3',
    region:          'auto',
  });

  const objectKey = `topics/${slug}.json`;
  const endpoint  = `https://${config.accountId}.r2.cloudflarestorage.com`;
  const uploadUrl = `${endpoint}/${config.bucketName}/${objectKey}`;

  const res = await aws.fetch(uploadUrl, {
    method:  'PUT',
    body:    JSON.stringify(payload, null, 2),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`R2 upload failed ${res.status}: ${msg}`);
  }

  return `${config.publicBaseUrl}/${objectKey}`;
}

export async function deleteTopicJson(slug: string): Promise<void> {
  const config = await getR2Config();

  const aws = new AwsClient({
    accessKeyId:     config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service:         's3',
    region:          'auto',
  });

  const objectKey = `topics/${slug}.json`;
  const endpoint  = `https://${config.accountId}.r2.cloudflarestorage.com`;
  await aws.fetch(`${endpoint}/${config.bucketName}/${objectKey}`, { method: 'DELETE' });
}
