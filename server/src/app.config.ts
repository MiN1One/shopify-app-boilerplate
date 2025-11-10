import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { join } from 'path';
import toml from 'toml';

const getShopifyScopes = async () => {
  try {
    const filePath = join(process.cwd(), '../shopify.app.toml');
    const config = await readFile(filePath, 'utf-8');
    const {
      access_scopes: { scopes },
    } = toml.parse(config);
    return scopes.replaceAll(' ', '').split(',') as string[];
  } catch (er) {
    Logger.error('Error reading shopify.app.toml');
    return [];
  }
};

export const appConfig = registerAs('config', async () => {
  const shopifyScopes = await getShopifyScopes();
  return {
    dbUrl: process.env.DATABASE_URL || '',
    isDev: process.env.NODE_ENV === 'development',
    devClientProxy: process.env.DEV_CLIENT_PROXY || '',
    shopifyApiSecret: process.env.SHOPIFY_API_SECRET || '',
    shopifyApiKey: process.env.SHOPIFY_API_KEY || '',
    shopifyScopes,
    host: process.env.HOST || 'http://localhost:6000',
    port: parseInt(process.env.PORT || '6000', 10),
  };
});
