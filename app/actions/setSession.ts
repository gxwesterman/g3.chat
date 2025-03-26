'use server'
import { createSession } from '@/app/lib/session'
import { id } from '@instantdb/react';
import { cookies } from 'next/headers'

export async function setSession() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session');
    if (!session) {
      await createSession(id());
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
  }
}