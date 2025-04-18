// 'use client';

// import Link from "next/link";
// import { useUser } from '@auth0/nextjs-auth0/client';

// export default function Home() {

//   const { isLoading, error, user } = useUser();

//   if (isLoading) return <div>Loading...</div>;

//   if (error) return <div>{error.message}</div>;

//   return (
//     <>
//       <div className="flex justify-center items-center min-h-screen w-full bg-gray-800 text-white text-center">
//         <div>
//           {user ? (
//             <div className='bg-gray-600 shadow-md rounded-md p-10 m-5'>
//               <Link href="/api/auth/logout" className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600">Logout</Link>
//             </div>
//           ) : (
//             <>
//               <Link href="/api/auth/login" className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600">Login</Link>
//               <Link href="/api/auth/login?signup=true" className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600">Signup</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
