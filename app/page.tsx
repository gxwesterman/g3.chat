'use client'
import { setSession } from '@/app/actions/setSession'
import { useEffect } from 'react';
 
export default function Page() {
 useEffect(() => {
  setSession();
 }, []);
}