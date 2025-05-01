'use server'
import { createSession } from '@/app/lib/session'
import { id } from '@instantdb/react';
import { initDefaultPages } from '@/app/lib/instant';

export async function setSession() {
  try {
    const sessionId = id();
    await createSession(sessionId);
    await initDefaultPages(sessionId);
  } catch (error) {
    console.log(error);
  }
}