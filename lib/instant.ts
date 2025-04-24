import { init } from '@instantdb/react';
import { init as init_admin } from '@instantdb/admin'; 
import schema from '@/lib/instant.schema';
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID as string;
const ADMIN_TOKEN = process.env.INSTANT_APP_ADMIN_TOKEN as string;
export const db = init({
  appId: APP_ID,
  schema
});
export const admin_db = init_admin({
  appId: APP_ID,
  adminToken: ADMIN_TOKEN,
  schema
})