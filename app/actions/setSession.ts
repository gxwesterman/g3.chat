'use server'
import { createSession } from '@/app/lib/session'
import { id } from '@instantdb/react';
import { redirect } from 'next/navigation';

export async function setSession(session: string | undefined) {
  console.log(session);
  if (!session) { await createSession(id()) };
  redirect('/chat');
}