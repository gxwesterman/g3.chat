'use server'
import { cookies } from 'next/headers'

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session');
  if (session) {
    return session.value;
  } else {
    return undefined;
  }
}