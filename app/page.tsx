'use client'
import { setSession } from '@/app/actions/setSession'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
 
export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const login = async () => {
      const session = setSession();
      session.then((value) => console.log(value));
    }
    login();
    router.push('/chat');
  }, []);
}