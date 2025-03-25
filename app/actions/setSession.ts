'use server'
import { createSession } from '@/app/lib/session'
import { id } from '@instantdb/react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'

export async function setSession() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session');
    if (!session) {
      await createSession(id());
    }
  } catch (error) {
    console.log(error);
  }
  redirect('/chat');
}