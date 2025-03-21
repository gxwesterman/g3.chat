'use server'
import { createSession } from '@/app/lib/session'
import { redirect } from 'next/navigation';
import { id } from '@instantdb/react';
import { cookies } from 'next/headers'

export async function setSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session');
  const sessionId = session ? session.value : id();
  await createSession(sessionId);
  redirect('/chat');
}