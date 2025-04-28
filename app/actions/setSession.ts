'use server'
import { createSession } from '@/app/lib/session'
import { id } from '@instantdb/react';
import { cookies } from 'next/headers';
import { initDefaultPages } from '@/app/lib/instant';

export async function setSession() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) {
      const sessionId = id();
      await initDefaultPages(sessionId);
      await createSession(sessionId);
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
  }
}