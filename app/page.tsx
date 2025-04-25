'use client'
import { setSession } from '@/app/actions/setSession'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
 
export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const login = async () => {
      const status = await setSession();
      if (status) {
        router.push('/chat/welcome');
      } else {
        router.push('/chat');
      }
    }
    login();
  }, []);
}