'use client';

import Link from "next/link";
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {

  const { isLoading, error, user } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <p>Welcome to the Next JS &amp; ChatGPT Starter</p>

      {user ? (
        <div className='bg-gray-600 shadow-md rounded-md p-10 m-5'>
          <h1>Welcome {user.name}!</h1>
          <h2>Please wait while we setup things for you ...</h2>
        </div>
      ) : (
        <>
          <Link href="/api/auth/login" className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600">Login</Link>
          <Link href="/api/auth/signup" className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600">Signup</Link>
        </>
      )}
    </div>
  );
}
