import { cookies } from 'next/headers'
import { setSession } from '@/app/actions/setSession'
 
export default async function Page() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  await setSession(session?.value);
  return '...'
}